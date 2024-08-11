import React, { useEffect, useRef } from 'react';

export const MoveHist = React.memo(({moveHist}:{moveHist: [{move:{
      from: string,
      to: string
}, playedBy: string}]}) => {
      const scrollRef = useRef<HTMLDivElement | null>(null);

      useEffect(() => {
            const scrollToBottom = () => {
                  if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                  }
            };
            scrollToBottom();

            // And then scroll again after a short delay
            const timeoutId = setTimeout(scrollToBottom, 100000);

            // Cleanup the timeout
            return () => clearTimeout(timeoutId);
      }, [moveHist]);

      console.log("moveHist");
      return (
        <div 
          ref={scrollRef}
          className="move-hist-container h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
        >
          {
            moveHist.map((item, i) => {
              const colClass = item.playedBy === 'w' ? "bg-white" : "bg-green-800 text-white";
              return (
                <p key={i} className={`${colClass} px-2 py-1`}>
                  {i+1}. {item.playedBy} {item.move.from} - {item.move.to}
                </p>
              );
            })
          }
        </div>
      );
});

// scroll bottom feature not working
