import { VideoManagement } from './functions/videos';

async function start() {
    try {
        console.log('Starting YouTube Service...');
        console.log('Environment check:');
        console.log('API Key:', process.env.YOUTUBE_API_KEY ? 'Set' : 'Not set');
        
        console.log('Initializing video manager...');
        const videoManager = new VideoManagement();

        console.log('Fetching video details...');
        const videoDetails = await videoManager.getVideo({ 
            videoId: 'dQw4w9WgXcQ',
            parts: ["snippet", "statistics", "contentDetails"]
        });
        
        console.log('\nVideo details:');
        console.log(JSON.stringify(videoDetails, null, 2));
        console.log('\nService operation completed successfully.');
    } catch (error) {
        console.error('\nError occurred:');
        console.error(error.message);
        if (error.response) {
            console.error('\nAPI Response Error:');
            console.error(JSON.stringify(error.response.data, null, 2));
        }
    }
}

start();