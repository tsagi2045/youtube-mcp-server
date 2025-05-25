import { VideoService } from '../../src/services/video';

const mockVideosList = jest.fn();
const mockYoutube = {
  videos: { list: mockVideosList },
  search: { list: jest.fn() }
};

jest.mock('googleapis', () => ({
  google: {
    youtube: jest.fn(() => mockYoutube)
  }
}));

describe('VideoService.getVideo', () => {
  it('정상적으로 비디오 정보를 반환해야 한다', async () => {
    process.env.YOUTUBE_API_KEY = 'test-key';
    mockVideosList.mockResolvedValue({ data: { items: [{ id: 'abc' }] } });
    const service = new VideoService();
    const result = await service.getVideo({ videoId: 'abc' });
    expect(result).toEqual({ id: 'abc' });
    expect(mockVideosList).toHaveBeenCalled();
  });
});
