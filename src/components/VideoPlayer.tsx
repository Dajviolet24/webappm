
import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, poster }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        src={videoUrl}
        playsInline
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
          
          <button
            onClick={handleMute}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
          
          <button
            onClick={handleFullscreen}
            className="p-2 hover:bg-white/10 rounded-full transition-colors ml-auto"
          >
            <Maximize className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
