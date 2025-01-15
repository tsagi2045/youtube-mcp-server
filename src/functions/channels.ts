import { MCPFunction, MCPFunctionGroup } from "@modelcontextprotocol/sdk";
import { YoutubeTranscript } from "youtube-transcript";
import * as ytdl from "ytdl-core";
import * as fs from "fs/promises";

// Utility functions
function safeGet<T>(obj: any, path: string, defaultValue?: T): T | undefined {
  return path.split('.').reduce((acc, part) => 
    acc && acc[part] !== undefined ? acc[part] : defaultValue, obj);
}

function safeParse(value: string | number | null | undefined, defaultValue = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

function safelyExecute<T>(fn: () => T): T | null {
  try {
    return fn();
  } catch (error: unknown) {
    console.error('Execution error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export class ChannelManagement implements MCPFunctionGroup {
  private youtube: any;

  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });
  }

  @MCPFunction({
    description: 'Get channel details',
    parameters: {
      type: 'object',
      properties: {
        channelId: { type: 'string' }
      },
      required: ['channelId']
    }
  })
  async getChannel({ 
    channelId 
  }: { 
    channelId: string 
  }): Promise<any> {
    try {
      const response = await this.youtube.channels.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: [channelId]
      });

      return response.data.items?.[0] || null;
    } catch (error) {
      throw new Error(`Failed to get channel: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  @MCPFunction({
    description: 'Get channel playlists',
    parameters: {
      type: 'object',
      properties: {
        channelId: { type: 'string' },
        maxResults: { type: 'number' }
      },
      required: ['channelId']
    }
  })
  async getChannelPlaylists({ 
    channelId, 
    maxResults = 50 
  }: { 
    channelId: string, 
    maxResults?: number 
  }): Promise<any[]> {
    try {
      const response = await this.youtube.playlists.list({
        part: ['snippet', 'contentDetails'],
        channelId,
        maxResults
      });

      return response.data.items || [];
    } catch (error) {
      throw new Error(`Failed to get channel playlists: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  @MCPFunction({
    description: 'Get channel videos',
    parameters: {
      type: 'object',
      properties: {
        channelId: { type: 'string' },
        maxResults: { type: 'number' }
      },
      required: ['channelId']
    }
  })
  async getChannelVideos({ 
    channelId, 
    maxResults = 50 
  }: { 
    channelId: string, 
    maxResults?: number 
  }): Promise<any[]> {
    try {
      const response = await this.youtube.search.list({
        part: ['snippet'],
        channelId,
        maxResults,
        order: 'date',
        type: ['video']
      });

      return response.data.items || [];
    } catch (error) {
      throw new Error(`Failed to get channel videos: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Additional methods for channel management can be added here
  @MCPFunction({
    description: 'Analyze channel performance overview',
    parameters: {
      type: 'object',
      properties: {
        channelId: { type: 'string' }
      },
      required: ['channelId']
    }
  })
  async getChannelPerformanceOverview({ 
    channelId 
  }: { 
    channelId: string 
  }): Promise<any> {
    try {
      const [channelDetails, playlists, videos] = await Promise.all([
        this.getChannel({ channelId }),
        this.getChannelPlaylists({ channelId, maxResults: 10 }),
        this.getChannelVideos({ channelId, maxResults: 10 })
      ]);

      return {
        channelInfo: {
          title: channelDetails.snippet.title,
          description: channelDetails.snippet.description,
          subscriberCount: safeParse(channelDetails.statistics.subscriberCount),
          totalVideoViews: safeParse(channelDetails.statistics.viewCount)
        },
        playlistsSummary: {
          total: playlists.length,
          recentPlaylists: playlists.map(pl => ({
            title: pl.snippet.title,
            videoCount: pl.contentDetails.itemCount
          }))
        },
        videosSummary: {
          total: videos.length,
          recentVideos: videos.map(video => ({
            title: video.snippet.title,
            publishedAt: video.snippet.publishedAt
          }))
        }
      };
    } catch (error) {
      throw new Error(`Failed to get channel performance overview: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}