from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel, set_tracing_disabled
from dotenv import find_dotenv, load_dotenv
import os
# from LLM import llm_model
load_dotenv(find_dotenv())
gemini_api_key = os.getenv("GEMINI_API_KEY")

# Tracing disabled
set_tracing_disabled(disabled=True)

# 1. Which LLM Service?
external_client: AsyncOpenAI = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

# 2. Which LLM Model?
llm_model: OpenAIChatCompletionsModel = OpenAIChatCompletionsModel(
    model="gemini-2.0-flash",
    openai_client=external_client
)
math_agent: Agent = Agent(name="MathAgent",
                     instructions="You are a helpful math assistant.",
                     model=llm_model
                     ) # gemini-2.5 as agent brain - chat completions

result: Runner = Runner.run_sync(math_agent, "why learn math for AI Agents?")

print("\nCALLING AGENT\n")
print(result.final_output)