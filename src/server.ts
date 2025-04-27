// @ts-ignore - Ignore MCP SDK import error during compilation
import { McpServer } from '@modelcontextprotocol/sdk';
import { VideoService } from './services/video';
import { TranscriptService } from './services/transcript';
import { PlaylistService } from './services/playlist';
import { ChannelService } from './services/channel';

export async function startMcpServer() {
    // Create MCP server
    const server = new McpServer({
        name: 'YouTube MCP Server',
        version: '1.0.0',
        description: 'MCP Server for interacting with YouTube content and services',
    });

    // Create service instances - they won't initialize APIs until methods are called
    const videoService = new VideoService();
    const transcriptService = new TranscriptService();
    const playlistService = new PlaylistService();
    const channelService = new ChannelService();

    // Register video functions
    server.addMethod({
        name: 'videos.getVideo',
        description: 'Get detailed information about a YouTube video',
        parameters: {
            type: 'object',
            properties: {
                videoId: {
                    type: 'string',
                    description: 'The YouTube video ID',
                },
                parts: {
                    type: 'array',
                    description: 'Parts of the video to retrieve',
                    items: {
                        type: 'string',
                    },
                },
            },
            required: ['videoId'],
        },
        handler: async (params) => videoService.getVideo(params),
    });

    server.addMethod({
        name: 'videos.searchVideos',
        description: 'Search for videos on YouTube',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query',
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum number of results to return',
                },
            },
            required: ['query'],
        },
        handler: async (params) => videoService.searchVideos(params),
    });

    // Register transcript functions
    server.addMethod({
        name: 'transcripts.getTranscript',
        description: 'Get the transcript of a YouTube video',
        parameters: {
            type: 'object',
            properties: {
                videoId: {
                    type: 'string',
                    description: 'The YouTube video ID',
                },
                language: {
                    type: 'string',
                    description: 'Language code for the transcript',
                },
            },
            required: ['videoId'],
        },
        handler: async (params) => transcriptService.getTranscript(params),
    });

    // Register channel functions
    server.addMethod({
        name: 'channels.getChannel',
        description: 'Get information about a YouTube channel',
        parameters: {
            type: 'object',
            properties: {
                channelId: {
                    type: 'string',
                    description: 'The YouTube channel ID',
                },
            },
            required: ['channelId'],
        },
        handler: async (params) => channelService.getChannel(params),
    });

    server.addMethod({
        name: 'channels.listVideos',
        description: 'Get videos from a specific channel',
        parameters: {
            type: 'object',
            properties: {
                channelId: {
                    type: 'string',
                    description: 'The YouTube channel ID',
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum number of results to return',
                },
            },
            required: ['channelId'],
        },
        handler: async (params) => channelService.listVideos(params),
    });

    // Register playlist functions
    server.addMethod({
        name: 'playlists.getPlaylist',
        description: 'Get information about a YouTube playlist',
        parameters: {
            type: 'object',
            properties: {
                playlistId: {
                    type: 'string',
                    description: 'The YouTube playlist ID',
                },
            },
            required: ['playlistId'],
        },
        handler: async (params) => playlistService.getPlaylist(params),
    });

    server.addMethod({
        name: 'playlists.getPlaylistItems',
        description: 'Get videos in a YouTube playlist',
        parameters: {
            type: 'object',
            properties: {
                playlistId: {
                    type: 'string',
                    description: 'The YouTube playlist ID',
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum number of results to return',
                },
            },
            required: ['playlistId'],
        },
        handler: async (params) => playlistService.getPlaylistItems(params),
    });

    // Log the server info
    console.log(`Starting YouTube MCP Server v1.0.0`);
    console.log(`Server will validate YouTube API key when methods are called`);
    
    // Start the server
    await server.listen();
    console.log('Server is listening for requests...');
    return server;
}