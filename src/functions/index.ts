import { VideoManagement } from './videos';

async function main() {
    try {
        console.log('Starting YouTube Service...');
        
        const videoManager = new VideoManagement();
        
        // Example usage
        const video = await videoManager.getVideo('dQw4w9WgXcQ');
        console.log('Video details:', video);
        
        console.log('Service initialized successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();