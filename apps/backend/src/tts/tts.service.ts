import { Injectable, BadRequestException } from '@nestjs/common';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TtsService {
  private readonly speechConfig: sdk.SpeechConfig;

  constructor(public configService: ConfigService) {
    this.speechConfig = sdk.SpeechConfig.fromSubscription(
      configService.get('AZURE_TTS_KEY'),
      configService.get('AZURE_TTS_REGION'),
    );
    this.speechConfig.speechSynthesisVoiceName = 'en-US-AvaMultilingualNeural';
  }

  public create(text: string) {
    const audioConfig =
      sdk.AudioConfig.fromAudioFileOutput('pronunciation.wav');
    let synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, audioConfig);

    return synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          synthesizer.close();
          synthesizer = null;

          // return new Blob([result.audioData], { type: 'audio.wav' });
        } else {
          synthesizer.close();
          synthesizer = null;
          throw new BadRequestException(
            'Speech synthesis canceled, ' +
              result.errorDetails +
              '\nDid you set the speech resource key and region values?',
          );
        }
      },
      (err) => {
        synthesizer.close();
        synthesizer = null;
        throw new BadRequestException(err);
      },
    );
  }
}
