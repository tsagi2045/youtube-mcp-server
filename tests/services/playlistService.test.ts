import { PlaylistService } from '../../src/services/playlist';

const mockPlaylistsList = jest.fn();
const mockYoutube = {
  playlists: { list: mockPlaylistsList }
};

jest.mock('googleapis', () => ({
  google: {
    youtube: jest.fn(() => mockYoutube)
  }
}));

describe('PlaylistService.getPlaylist', () => {
  it('플레이리스트 정보를 반환해야 한다', async () => {
    process.env.YOUTUBE_API_KEY = 'test-key';
    mockPlaylistsList.mockResolvedValue({ data: { items: [{ id: 'pl1' }] } });
    const service = new PlaylistService();
    const result = await service.getPlaylist({ playlistId: 'pl1' });
    expect(result).toEqual({ id: 'pl1' });
    expect(mockPlaylistsList).toHaveBeenCalled();
  });
});
