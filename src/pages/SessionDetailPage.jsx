import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowLeft, Play, Pause, Volume2, Clock, BookOpen, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const sessionsData = {
  "1": {
    childName: "Amaury T.",
    childAge: "2y 4m",
    episode: "Morning Routine",
    duration: "5m 12s",
    date: "Feb 9, 2026",
    targetWord: "Bonjou (Good morning)",
    detectedPattern: "Fronting",
    feedback: "The child is making wonderful progress! The 'k' sound is being produced as 't', which is a very common developmental pattern at this age. With continued practice, this will naturally develop over time.",
    audioProgress: 0,
  },
  "2": {
    childName: "Léa M.",
    childAge: "1y 8m",
    episode: "Animal Friends",
    duration: "3m 45s",
    date: "Feb 9, 2026",
    targetWord: "Chat (Cat)",
    detectedPattern: "Deletion",
    feedback: "Léa is doing great with animal sounds! Final consonant deletion is expected at this developmental stage. The child is actively engaged and making consistent attempts.",
    audioProgress: 0,
  },
  "3": {
    childName: "Noah B.",
    childAge: "2y 1m",
    episode: "Color World",
    duration: "4m 08s",
    date: "Feb 8, 2026",
    targetWord: "Rouge (Red)",
    detectedPattern: "Gliding",
    feedback: "Noah shows excellent engagement with color vocabulary! The 'r' sound being produced as 'w' is a typical developmental pattern. Keep encouraging these wonderful attempts!",
    audioProgress: 0,
  },
};

export default function SessionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const sessionId = id || "1";
  const session = sessionsData[sessionId] || sessionsData["1"];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate audio progress
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/sessions")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Session Details</h2>
          <p className="text-sm text-muted-foreground">{session.date} • {session.duration}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl shadow-card border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
              <Users className="h-5 w-5 text-lavender-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Child</span>
          </div>
          <p className="font-bold text-foreground">{session.childName}</p>
          <p className="text-xs text-muted-foreground">Age: {session.childAge}</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-sky flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-sky-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Episode</span>
          </div>
          <p className="font-bold text-foreground">{session.episode}</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-mint flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-mint-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Target Word</span>
          </div>
          <p className="font-bold text-foreground">{session.targetWord}</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-warm flex items-center justify-center">
              <Clock className="h-5 w-5 text-warm-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Duration</span>
          </div>
          <p className="font-bold text-foreground">{session.duration}</p>
        </div>
      </div>

      {/* Audio Playback */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-bold text-foreground mb-4">Child Audio Recording</h3>
        <div className="bg-muted rounded-xl p-6">
          <div className="flex items-center gap-4">
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <div className="flex-1">
              <div className="h-3 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-100"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{Math.floor(audioProgress / 100 * 312 / 60)}:{String(Math.floor(audioProgress / 100 * 312 % 60)).padStart(2, '0')}</span>
                <span>5:12</span>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Detected Pattern */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-bold text-foreground mb-4">Detected Speech Pattern</h3>
        <div className="flex items-center gap-4 mb-4">
          <span className="px-4 py-2 rounded-xl text-sm font-medium bg-sky text-sky-foreground">
            {session.detectedPattern}
          </span>
          <span className="text-sm text-muted-foreground">
            Common developmental pattern
          </span>
        </div>
        
        {/* Pattern explanation */}
        <div className="bg-muted rounded-xl p-4">
          <h4 className="font-medium text-foreground mb-2">What is {session.detectedPattern}?</h4>
          <p className="text-sm text-muted-foreground">
            {session.detectedPattern === "Fronting" && 
              "Fronting is when sounds made at the back of the mouth (like 'k' and 'g') are replaced with sounds made at the front (like 't' and 'd'). This is very common in children under 3 years old."}
            {session.detectedPattern === "Deletion" && 
              "Final consonant deletion is when the last consonant of a word is omitted. For example, 'cat' becomes 'ca'. This is a normal developmental pattern in young children."}
            {session.detectedPattern === "Gliding" && 
              "Gliding is when 'r' or 'l' sounds are replaced with 'w' or 'y'. For example, 'rabbit' becomes 'wabbit'. This typically resolves by age 5-6."}
            {session.detectedPattern === "Stopping" && 
              "Stopping is when fricative sounds (like 's', 'f', 'z') are replaced with stop sounds (like 't', 'p', 'd'). This is expected in early speech development."}
          </p>
        </div>
      </div>

      {/* Supportive Feedback */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-bold text-foreground mb-4">System Feedback</h3>
        <div className="bg-mint/20 rounded-xl p-5 border border-mint">
          <p className="text-foreground leading-relaxed">{session.feedback}</p>
        </div>
      </div>
    </div>
  );
}