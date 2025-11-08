// Video Configuration
// Update the ABOUT_VIDEO_ID with your YouTube video ID
// To get the video ID from a YouTube URL:
// Example: https://www.youtube.com/watch?v=VIDEO_ID_HERE
// or https://youtu.be/VIDEO_ID_HERE

// Hospital Overview Video - 30 second short video
// To find a 30-second hospital video:
// 1. Go to YouTube and search: "hospital tour short" or "hospital overview 30 seconds"
// 2. Filter by: Upload date > This year, Duration > Under 4 minutes
// 3. Look for videos around 30 seconds - 1 minute
// 4. Copy the video ID from the URL and paste below
export const ABOUT_VIDEO_ID = '74DWwSxsVSs'; // Modern Hospital Tour Video

// Optional: Video player configuration
export const VIDEO_CONFIG = {
  autoplay: true, // Auto-play video on load
  mute: true, // Mute video (required for autoplay to work)
  loop: true, // Loop/replay video continuously
  controls: true,
  modestbranding: true, // Minimal YouTube branding
  rel: 0, // Don't show related videos from other channels
};
