import { TranscriptService } from '../../src/services/transcript';

const fetchTranscriptMock = jest.fn();

jest.mock('youtube-transcript', () => ({
  YoutubeTranscript: { fetchTranscript: fetchTranscriptMock }
}));

describe('TranscriptService.getTranscript', () => {
  it('트랜스크립트를 반환해야 한다', async () => {
    fetchTranscriptMock.mockResolvedValue([{ text: 'hello', offset: 0, duration: 1 }]);
    const service = new TranscriptService();
    const result = await service.getTranscript({ videoId: 'v1' });
    expect(result).toEqual({
      videoId: 'v1',
      language: 'en',
      transcript: [{ text: 'hello', offset: 0, duration: 1 }]
    });
    expect(fetchTranscriptMock).toHaveBeenCalledWith('v1');
  });
});
