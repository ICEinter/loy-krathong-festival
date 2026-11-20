import React, { useState, useEffect, useRef } from 'react';
import { LoyKrathongScene } from './three/LoyKrathongScene';
import Header from './components/Header';
import FloatingActions from './components/FloatingActions';
import SelfieModal from './components/SelfieModal';
import VoteModal from './components/VoteModal';
import LeaderboardModal from './components/LeaderboardModal';
import {
  subscribeToKrathongs,
  saveKrathongToFirestore,
  voteKrathongInFirestore
} from './services/krathongService';
import { loyKrathongAudio } from './audio/loyKrathongMusic';

export default function App() {
  const containerRef = useRef(null);
  const sceneInstanceRef = useRef(null);

  // My Krathong Id (stored in localStorage)
  const [myKrathongId, setMyKrathongId] = useState(() => {
    return localStorage.getItem('my_loy_krathong_id') || 'krathong-1795164156938';
  });

  // Contestants list (real entries from Firestore or locally created)
  const [contestants, setContestants] = useState(() => {
    const saved = localStorage.getItem('loy_krathong_contestants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [selectedContestant, setSelectedContestant] = useState(null);
  const [isSelfieOpen, setIsSelfieOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [hasLoadedScene, setHasLoadedScene] = useState(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // 1. Subscribe to Firestore in Real-time
  useEffect(() => {
    const unsubscribe = subscribeToKrathongs(
      (firestoreItems) => {
        if (firestoreItems && firestoreItems.length > 0) {
          setIsFirestoreConnected(true);
          setContestants(firestoreItems);
          localStorage.setItem('loy_krathong_contestants', JSON.stringify(firestoreItems));

          // If user doesn't have an ID yet, link to the latest created item
          if (!localStorage.getItem('my_loy_krathong_id')) {
            const latestId = firestoreItems[0].id;
            localStorage.setItem('my_loy_krathong_id', latestId);
            setMyKrathongId(latestId);
          }
        }
      },
      (error) => {
        console.warn("Firestore error:", error);
        setIsFirestoreConnected(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 2. Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new LoyKrathongScene(containerRef.current, {
      myKrathongId: myKrathongId,
      onSelectKrathong: (contestant) => {
        setSelectedContestant(prev => {
          const current = contestants.find(c => c.id === contestant.id) || contestant;
          return current;
        });
      }
    });

    scene.setContestants(contestants, myKrathongId);
    sceneInstanceRef.current = scene;
    setHasLoadedScene(true);

    return () => {
      scene.dispose();
      sceneInstanceRef.current = null;
    };
  }, []);

  // 3. Update 3D scene when contestants or myKrathongId changes
  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setContestants(contestants, myKrathongId);
    }
  }, [contestants, myKrathongId]);

  // 4. Handle New Krathong Submission
  const handleAddKrathong = async (newContestant) => {
    // Set as MY krathong
    localStorage.setItem('my_loy_krathong_id', newContestant.id);
    setMyKrathongId(newContestant.id);

    // Update state
    setContestants(prev => [newContestant, ...prev.filter(c => c.id !== newContestant.id)]);

    // Launch in 3D scene with 'My Krathong' special beacon
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.launchNewKrathong(newContestant, true);
    }

    // Save to Firestore
    try {
      await saveKrathongToFirestore(newContestant);
      setIsFirestoreConnected(true);
    } catch (err) {
      console.warn("Could not save to Firestore, saved locally:", err);
    }
  };

  // 5. Handle Vote
  const handleVote = async (id) => {
    setContestants(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, votes: (item.votes || 0) + 1 };
          setSelectedContestant(updated);
          return updated;
        }
        return item;
      })
    );

    try {
      await voteKrathongInFirestore(id);
      setIsFirestoreConnected(true);
    } catch (err) {
      console.warn("Could not vote in Firestore, updated locally:", err);
    }
  };

  // 6. Reset Camera View
  const handleResetCamera = () => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.camera.position.set(0, 16, 36);
      sceneInstanceRef.current.controls.target.set(0, 0.8, 0);
    }
  };

  // 7. Focus Camera on My Krathong
  const handleFocusMyKrathong = () => {
    if (sceneInstanceRef.current && myKrathongId) {
      const group = sceneInstanceRef.current.krathongObjects.get(myKrathongId);
      if (group) {
        sceneInstanceRef.current.focusOnPosition(group.position.x, 0.8, group.position.z);
        if (sceneInstanceRef.current.activeFocusLight) {
          sceneInstanceRef.current.activeFocusLight.position.set(group.position.x, 2, group.position.z);
          sceneInstanceRef.current.activeFocusLight.intensity = 2.0;
        }
      }
    }
  };

  // 8. Toggle Loy Krathong Music
  const handleToggleMusic = () => {
    const playing = loyKrathongAudio.toggle();
    setIsPlayingMusic(playing);
  };

  const totalVotes = contestants.reduce((acc, curr) => acc + (curr.votes || 0), 0);
  const hasMyKrathong = !!(myKrathongId && contestants.some(c => c.id === myKrathongId));

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#040814] select-none">
      
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Header */}
      <Header
        totalVotes={totalVotes}
        contestantCount={contestants.length}
        isFirestoreConnected={isFirestoreConnected}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        hasMyKrathong={hasMyKrathong}
        onFocusMyKrathong={handleFocusMyKrathong}
      />

      {/* Bottom Floating Bar */}
      <FloatingActions
        onOpenSelfie={() => setIsSelfieOpen(true)}
        onResetCamera={handleResetCamera}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        hasMyKrathong={hasMyKrathong}
        onFocusMyKrathong={handleFocusMyKrathong}
      />

      {/* Selfie & Submit Modal */}
      <SelfieModal
        isOpen={isSelfieOpen}
        onClose={() => setIsSelfieOpen(false)}
        onSubmitKrathong={handleAddKrathong}
      />

      {/* Krathong Click Popup & Vote Modal */}
      <VoteModal
        contestant={selectedContestant}
        onClose={() => setSelectedContestant(null)}
        onVote={handleVote}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        contestants={contestants}
        onSelectContestant={(contestant) => {
          setSelectedContestant(contestant);
          if (sceneInstanceRef.current) {
            const group = sceneInstanceRef.current.krathongObjects.get(contestant.id);
            if (group) {
              sceneInstanceRef.current.focusOnPosition(group.position.x, 0.8, group.position.z);
            }
          }
        }}
      />

      {/* Loading Overlay Hint */}
      {!hasLoadedScene && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#040814] z-50 text-amber-300">
          <div className="text-4xl animate-bounce mb-3">🪷</div>
          <p className="text-sm font-semibold tracking-wider">กำลังเนรมิตฉากงานลอยกระทง 3D & เชื่อมต่อ Firestore...</p>
        </div>
      )}

    </div>
  );
}
