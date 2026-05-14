import torch
import torchaudio
import torchaudio.transforms as T
import io

class AudioProcessor:
    def __init__(self, sample_rate=32000, n_mels=64):
        self.sample_rate = sample_rate
        # We use 64 bins to match the 18k Jamendo subset architecture
        self.mel_transform = T.MelSpectrogram(
            sample_rate=self.sample_rate,
            n_fft=1024,
            hop_length=320,
            n_mels=n_mels
        )
        self.amplitude_to_db = T.AmplitudeToDB()

    def process_buffer(self, audio_bytes: io.BytesIO):
        """
        Takes a raw RAM buffer and returns a normalized Mel-spectrogram tensor.
        """
        # 1. Load from RAM
        waveform, sr = torchaudio.load(audio_bytes)

        # 2. Convert to Mono if Stereo
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        # 3. Resample to 32kHz (PANNs standard)
        if sr != self.sample_rate:
            resampler = T.Resample(orig_freq=sr, new_freq=self.sample_rate)
            waveform = resampler(waveform)

        # 4. Generate Mel-spectrogram
        # The model sees "images" of sound rather than raw waves
        mel_spec = self.mel_transform(waveform)
        log_mel_spec = self.amplitude_to_db(mel_spec)

        return log_mel_spec # Shape: [1, 64, Time]