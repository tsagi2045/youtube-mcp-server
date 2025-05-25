import { ChannelService } from '../../src/services/channel';

const mockChannelsList = jest.fn();
const mockYoutube = {
  channels: { list: mockChannelsList }
};

jest.mock('googleapis', () => ({
  google: {
    youtube: jest.fn(() => mockYoutube)
  }
}));

describe('ChannelService.getChannel', () => {
  it('채널 정보를 받아와야 한다', async () => {
    process.env.YOUTUBE_API_KEY = 'test-key';
    mockChannelsList.mockResolvedValue({ data: { items: [{ id: 'ch1' }] } });
    const service = new ChannelService();
    const result = await service.getChannel({ channelId: 'ch1' });
    expect(result).toEqual({ id: 'ch1' });
    expect(mockChannelsList).toHaveBeenCalled();
  });
});
