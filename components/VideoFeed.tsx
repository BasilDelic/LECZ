
import React from 'react';
import { MOCK_VIDEOS } from '../constants';
import VideoCard from './VideoCard';

interface VideoFeedProps {
  followingIds: string[];
  onToggleFollow: (id: string) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ followingIds, onToggleFollow }) => {
  return (
    <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {MOCK_VIDEOS.map((video) => (
        <div key={video.id} className="h-full w-full snap-start relative">
          <VideoCard 
            video={video} 
            isFollowing={followingIds.includes(video.sellerId)}
            onToggleFollow={() => onToggleFollow(video.sellerId)}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
