import { MapComponent } from "../MapComponent/Scripts/MapComponent";
import { RemoteServiceModule } from "RemoteServiceGateway.lspkg/RemoteServiceModule";
import { OpenAI } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAI";
import { DeepSeek } from "RemoteServiceGateway.lspkg/HostedSnap/Deepseek";
import { DeepSeekTypes } from "RemoteServiceGateway.lspkg/HostedSnap/DeepSeekTypes";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { ViewportAnalyzer } from "./ViewportAnalyzer";
import { PromptGenerator } from "./PromptGenerator";
import { AudioFeedbackController } from "./AudioFeedbackController";

const TAG = "[MapAIController]";
const log = new NativeLogger(TAG);

export enum AIProvider {
  OpenAI = "OpenAI",
  DeepSeek = "DeepSeek",
  Gemini = "Gemini"
}

@component
export class MapAIController extends BaseScriptComponent {
  @input
  private mapComponent: MapComponent;
  
  @input
  private askAIButton: PinchButton;
  
  @input
  private remoteServiceModule: RemoteServiceModule;
  
  @input
  private audioFeedbackController: AudioFeedbackController;
  
  @input
  @widget(new ComboBoxWidget([
    new ComboBoxItem("OpenAI (GPT-4)", "OpenAI"),
    new ComboBoxItem("DeepSeek-R1", "DeepSeek"),
    new ComboBoxItem("Gemini", "Gemini")
  ]))
  private aiProvider: string = "OpenAI";
  
  @input
  @hint("Enable detailed reasoning from DeepSeek-R1")
  private enableReasoning: boolean = true;
  
  @input
  @hint("Enable debug logging")
  private enableDebugLogs: boolean = false;
  
  @input
  @hint("Maximum tokens for AI response")
  private maxTokens: number = 300;
  
  @input
  @hint("Temperature for AI creativity (0.0-1.0)")
  @widget(new SliderWidget(0.0, 1.0, 0.1))
  private temperature: number = 0.7;
  
  @input
  @hint("Response language")
  @widget(new ComboBoxWidget([
    new ComboBoxItem("English", "en"),
    new ComboBoxItem("French", "fr"),
    new ComboBoxItem("Spanish", "es"),
    new ComboBoxItem("German", "de")
  ]))
  private language: string = "en";

  private viewportAnalyzer: ViewportAnalyzer;
  private promptGenerator: PromptGenerator;
  private isProcessing: boolean = false;
  
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }
  
  private onStart(): void {
    log.i("Initializing MapAIController");
    
    // Initialize sub-components
    this.viewportAnalyzer = new ViewportAnalyzer(this.mapComponent);
    this.promptGenerator = new PromptGenerator(this.language);
    
    // Setup button callback
    if (this.askAIButton) {
      this.askAIButton.onButtonPinched.add(() => this.handleAskAI());
    } else {
      log.e("Ask AI button not assigned!");
    }
    
    log.i("MapAIController initialized");
  }
  
  private debugLog(message: string): void {
    if (this.enableDebugLogs) {
      log.i(`[DEBUG] ${message}`);
    }
  }
  
  private async handleAskAI(): Promise<void> {
    if (this.isProcessing) {
      log.w("AI request already in progress, ignoring...");
      return;
    }
    
    this.isProcessing = true;
    this.debugLog("Ask AI button pressed");
    
    try {
      // 1. Analyze current viewport
      const viewportContext = this.viewportAnalyzer.analyzeViewport();
      this.debugLog(`Viewport: ${JSON.stringify(viewportContext)}`);
      
      // 2. Generate prompt
      const prompt = this.promptGenerator.generatePrompt(viewportContext);
      this.debugLog(`Prompt: ${prompt}`);
      
      // 3. Call AI service
      const aiResponse = await this.callAIService(prompt);
      this.debugLog(`AI Response: ${aiResponse}`);
      
      // 4. Convert to speech and play
      await this.audioFeedbackController.speakText(aiResponse);
      
      log.i("AI feedback completed successfully");
      
    } catch (error) {
      log.e(`AI request failed: ${error}`);
      await this.audioFeedbackController.speakText(
        "Sorry, I couldn't retrieve information about this area."
      );
    } finally {
      this.isProcessing = false;
    }
  }
  
  private async callAIService(prompt: string): Promise<string> {
    switch (this.aiProvider) {
      case "OpenAI":
        return this.callOpenAI(prompt);
      case "DeepSeek":
        return this.callDeepSeek(prompt);
      case "Gemini":
        return this.callGemini(prompt);
      default:
        throw new Error(`Unknown AI provider: ${this.aiProvider}`);
    }
  }
  
  private async callOpenAI(prompt: string): Promise<string> {
    this.debugLog("Calling OpenAI API...");
    
    const response = await OpenAI.chatCompletions({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: this.promptGenerator.getSystemPrompt()
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: this.temperature,
      max_tokens: this.maxTokens
    });
    
    return response.choices[0].message.content;
  }
  
  private async callDeepSeek(prompt: string): Promise<string> {
    this.debugLog("Calling DeepSeek API...");
    
    const messageArray: Array<DeepSeekTypes.ChatCompletions.Message> = [
      {
        role: "system",
        content: this.promptGenerator.getSystemPrompt()
      },
      {
        role: "user",
        content: prompt
      }
    ];
    
    const request: DeepSeekTypes.ChatCompletions.Request = {
      model: "DeepSeek-R1",
      messages: messageArray,
      max_tokens: this.maxTokens,
      temperature: this.temperature
    };
    
    const response = await DeepSeek.chatCompletions(request);
    
    if (this.enableReasoning && response.choices[0].message.reasoning_content) {
      this.debugLog(`Reasoning: ${response.choices[0].message.reasoning_content}`);
    }
    
    return response.choices[0].message.content;
  }
  
  private async callGemini(prompt: string): Promise<string> {
    // TODO: Implement Gemini integration
    throw new Error("Gemini integration not yet implemented");
  }
}