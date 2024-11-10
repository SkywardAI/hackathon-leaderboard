const {exec} = require("child_process")
const {readdirSync, readFileSync} = require("fs")
const {join} = require("path")
const crypto = require("crypto")
const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime")
const { openDB, getAll, insert, update } = require("./database")

const base_path = 'hackathon-converted-md'
const submission_filename = 'submission'
const file_type = 'md'

async function generateHash(arrayBuffer) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


const system_instructions = {
    '1': 
`This challenge emphasizes cloud infrastructure setup, resource management, and operational stability. The evaluation criteria are: 

Deployment Accuracy and Functionality (40%) 

The API must be correctly deployed on AWS EC2 and be accessible. 

The service should respond accurately and fulfill API requests. 

Bonus Points: Include documentation of the deployment process with clear steps and error-handling measures. 

Chat Competition API Integration (40%) 

Ensure successful integration of the chat competition APIs within the service. 

API endpoints should function reliably, handling requests effectively. 

Documentation and Usability (20%) 

Provide clear documentation on API setup and usage. 

Code and configuration documentation should be focused on readability and reproducibility. `,
    '2': 
`This challenge focuses on cryptographic skills, data integrity, and secure communication. 

Encryption and Decryption Functionality (30%) 

Implement accurate encryption and decryption functions. 

Ensure correct handling of edge cases to maintain data integrity. 

Messages should be encrypted and decrypted without data loss. 

Security Robustness (20%) 

Use a secure encryption algorithm (e.g., AES, RSA) with best practices, including padding, initialization vector (IV) use, and key management. 

Performance and Efficiency (10%) 

Assess the speed and memory efficiency of the encryption and decryption functions. 

Code Clarity and Documentation (10%) 

Code should be well-documented with explanations of encryption/decryption choices. 

Provide clear instructions for running the encryption and decryption functions. 

Voyager Project Integration (30%) 

Implement the encryption/decryption feature within the Voyager project. 

Ensure compatibility with the Voyager project’s existing framework. `,
    '3':
`This challenge involves fine-tuning a model to classify web traffic as either normal or malicious. The focus is on high model accuracy, effective fine-tuning, clear documentation, community sharing, and tracking metrics. 

Model Performance (30%) 

Fine-tuned model's classification performance is measured on validation data, using accuracy_score, precision_score, and f1_score. 

Fine-Tuning Process (30%) 

Evaluate the preprocessing, feature engineering, and fine-tuning methods used. 

Model Sharing on Hugging Face (10%) 

The fine-tuned model is successfully shared on Hugging Face, making it accessible for further use and evaluation. 

TensorBoard for Metrics (10%) 

Use TensorBoard to track fine-tuning metrics, providing a clear record of model performance. 

Documentation and Clarity (20%) 

Provide clear documentation of the fine-tuning approach, data preprocessing, and model structure. 

Ensure code readability and organization for reproducibility. `,
    '4':
`This challenge involves creating a past tense-based adversarial attack on an LLM hosted on AWS Bedrock, using AWS SageMaker notebooks for execution and evaluation. The focus is on implementing effective linguistic transformations, analyzing model robustness, documenting findings, and utilizing AWS services effectively. 

Attack Implementation (40%) 

Develop a function to accurately transform present-tense text into past tense. 

Ensure transformations maintain grammatical correctness, revealing potential vulnerabilities in the model's response consistency. 

AWS SageMaker and Bedrock Integration (30%) 

Demonstrate effective setup and configuration of the AWS SageMaker notebook environment to interact with AWS Bedrock. 

Use Boto3 to manage requests, ensuring accurate handling of input/output formatting and error management within the notebook. 

Documentation and Clarity (20%) 

Provide clear documentation detailing the transformation function, API usage, and evaluation methods within the notebook. 

Ensure code readability, organization, and reproducibility, with instructions for running the attack in SageMaker notebooks. 

Analysis of Model Robustness (10%) 

Conduct a quantitative analysis of response differences between original and past-tense prompts using metrics like similarity scores. `
}

for(const i in system_instructions) {
    system_instructions[i] = 
`You are a member at Hackathon Marking Panel and you are always making fair judgements. Your job is to define what is the mark of a submitted \`.ipynb\` file. The marking criteria is provided below: 
${system_instructions[i]}
Your marking should always between 1-100. Your response should always in a stricted XML format: <assistant_response><mark></mark><reason></reason></assistant_response>. You must not response anything outside the XML blocks. The <mark> section should always only have an integer in the range of 1 to 100, lowest mark is 1 and full mark is 100. You should always give fair mark based only on the criteria. You must think carefully to determine the score to avoid any unfair marking.`
}

async function marking() {
    await openDB('results.db');
    const recorded_results = await getAll();
    // retrieve and convert all matched codes
    console.log("Retriving submissions");
    // await new Promise(resolve=>{
    //     exec("python3 retrieve-competition.py", (error, stdout, stderr) => {
    //         resolve(!error && !stderr);
    //     })
    // })
    console.log("Start marking...")

    const files = readdirSync(base_path);
    const files_len = files.length;
    let current_num = 1;
    for(const f of files) {
        console.log(`Marking submission ${current_num++}/${files_len}.`);
        let filename_match = f.match(/^(?<campus>[^-]*)-(?<team_name>.*)-challenge-(?<challenge>\d+)-submission.md$/)
        let campus, team_name, challenge;
        if(filename_match) {
            const m = filename_match['groups'];
            campus = m.campus;
            team_name = m.team_name;
            challenge = m.challenge;
        }
        if(!system_instructions[challenge]) {
            console.log(f, "no-mark")
        } else {
            const file_buffer = new Uint8Array(readFileSync(join(base_path, f)))
            const file_hash = await generateHash(file_buffer);
            if(recorded_results.filter(e=>e.file_hash === file_hash).length) {
                continue;
            }
            const client = new BedrockRuntimeClient({region: 'ap-southeast-2'})
            const input = {
                modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
                messages: [
                    { role: 'user', content: [
                        { text: "This is the submission you need to give marks" },
                        { document: {
                            name: submission_filename,
                            format: file_type,
                            source: { bytes: file_buffer }
                        } }
                    ] }
                ],
                inferenceConfig: {
                    temperature: 0.2,
                    topP: 0.9
                },
                system: [
                    {text: system_instructions[challenge]}
                ]
            }

            const command = new ConverseCommand(input)
            const response = await client.send(command);
            const response_text = response.output.message.content[0].text;
            const match_cases = response_text.match(/<assistant_response>\s*<mark>(?<mark>.*)<\/mark>\s*<reason>(?<reason>[\s\S]*?)<\/reason>\s*<\/assistant_response>/)
            if(match_cases) {
                const {mark, reason} = match_cases['groups'];
                const save_result = {
                    mark: +mark, mark_str: mark,
                    reason, filename: f, file_hash, campus, team_name, challenge
                }
                if(recorded_results.filter(e=>e.filename === f).length) {
                    await update(save_result)
                } else {
                    await insert(save_result);
                }
            }
        }
    }
    console.log("Marking finished.")
}

async function calculateLeadingTeam() {
    await openDB('results.db');
    const recorded_results = await getAll();

    const scores = {};

    for(const { team_name, mark, campus } of recorded_results) {
        scores[team_name] ??= {};
        scores[team_name].campus ??= campus
        scores[team_name].mark ??= 0;
        scores[team_name].mark += mark;
    }

    return Object.keys(scores).map(team_name=>{
        const { mark:score, campus } = scores[team_name]
        return { name: team_name, score, campus }
    }).sort((a, b)=>b.score - a.score)
}

module.exports = {
    marking, calculateLeadingTeam
};