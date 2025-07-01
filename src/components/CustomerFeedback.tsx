
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import StarRating from './StarRating';
import { submitFeedback, fetchLinkById, fetchSettings } from '@/lib/api';

interface FeedbackFormProps {
  refId?: string;
}

const CustomerFeedback: React.FC<FeedbackFormProps> = ({ refId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [linkData, setLinkData] = useState<any>(null);
  const [concernText, setConcernText] = useState('Wie war Ihre Erfahrung mit unserem Service?');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!refId) {
        setError('Ungültiger Feedback-Link');
        return;
      }

      try {
        // Link-Daten laden
        console.log('Loading link data for ref:', refId);
        const link = await fetchLinkById(refId);
        console.log('Link data loaded:', link);
        
        if (link.used) {
          setError('Dieser Feedback-Link wurde bereits verwendet und ist nicht mehr gültig.');
          return;
        }
        
        setLinkData(link);

        // Aktuelle Einstellungen laden für Concern-Text
        try {
          const settings = await fetchSettings();
          console.log('Settings loaded:', settings);
          if (settings.concern_texts && settings.concern_texts[link.concern]) {
            setConcernText(settings.concern_texts[link.concern]);
            console.log('Using custom concern text:', settings.concern_texts[link.concern]);
          }
        } catch (settingsError) {
          console.error('Error loading settings, using default text:', settingsError);
          // Fallback auf Standard-Texte
          const defaultTexts: Record<string, string> = {
            'Internet-Freischaltung': 'Kürzlich wurde Ihr Internet freigeschaltet. Wie war Ihre Erfahrung mit unserem Service?',
            'Störung': 'Wir haben Ihre gemeldete Störung bearbeitet. Wie zufrieden sind Sie mit der Lösung?',
            'Servicebesuch': 'Unser Techniker war bei Ihnen vor Ort. Wie bewerten Sie den Servicebesuch?',
            'Beratung': 'Sie haben eine Beratung bei uns erhalten. Wie hilfreich war unser Beratungsgespräch?',
            'Rechnung': 'Bezüglich Ihrer Rechnungsanfrage: Wie zufrieden sind Sie mit der Bearbeitung?',
            'Kündigung': 'Ihre Kündigung wurde bearbeitet. Wie bewerten Sie unseren Kündigungsprozess?',
            'Sonstiges': 'Wie war Ihre Erfahrung mit unserem Service?'
          };
          setConcernText(defaultTexts[link.concern] || 'Wie war Ihre Erfahrung mit unserem Service?');
        }
      } catch (error) {
        console.error('Error loading link data:', error);
        setError('Feedback-Link nicht gefunden oder ungültig');
      }
    };

    loadData();
  }, [refId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Bitte geben Sie eine Bewertung ab');
      return;
    }

    if (!refId || !linkData) {
      toast.error('Ungültiger Feedback-Link');
      return;
    }

    setLoading(true);
    try {
      await submitFeedback({
        rating,
        comment: comment.trim(),
        customer: linkData.customer_number,
        customerName: `${linkData.first_name} ${linkData.last_name}`,
        concern: linkData.concern,
        refId
      });
      
      setSubmitted(true);
      toast.success('Vielen Dank für Ihr Feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Fehler beim Absenden des Feedbacks');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Link nicht verfügbar</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vielen Dank!</h2>
            <p className="text-gray-600 mb-4">
              Ihr Feedback wurde erfolgreich übermittelt.
            </p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Bewertung: {rating} von 5 Sternen
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Lade Feedback-Formular...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Feedback
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Hallo {linkData.first_name} {linkData.last_name}
          </p>
          <p className="text-sm text-gray-500">
            Kundennummer: {linkData.customer_number}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              {concernText}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <Label className="text-lg font-medium mb-4 block">
                Wie bewerten Sie unseren Service?
              </Label>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size={40}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">
                Zusätzliche Kommentare (optional)
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Teilen Sie uns mit, wie wir uns verbessern können..."
                rows={4}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={rating === 0 || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Wird gesendet...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Feedback absenden
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-gray-500">
            Vielen Dank, dass Sie sich die Zeit für Ihr Feedback nehmen!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerFeedback;
