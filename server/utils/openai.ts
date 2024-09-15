import OpenAI from "openai";

const config = useRuntimeConfig();

const openaiConfig = new OpenAI({
  // apiKey: config.openai.apiToken,  // This should be the API key
  apiKey: config.openai.apiKey,
  organization: config.openai.organizationId,  // Use the organization ID here
  project: config.openai.projectId,  // Set the project ID here if needed
});

export const $openai = openaiConfig;