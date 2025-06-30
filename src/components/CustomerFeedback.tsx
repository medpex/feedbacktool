
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, MessageSquare, Star as StarIcon } from 'lucide-react';
import StarRating from './StarRating';

const CustomerFeedback = () => {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingSubmit = () => {
    if (rating > 0) {
      setStep(2);
    }
  };

  const handleFeedbackSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store feedback in localStorage for demo purposes
    const feedbackData = {
      id: Date.now(),
      rating,
      comment: feedback,
      timestamp: new Date().toISOString(),
      customer: 'Anonymous'
    };
    
    const existing = JSON.parse(localStorage.getItem('feedback') || '[]');
    existing.push(feedbackData);
    localStorage.setItem('feedback', JSON.stringify(existing));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleSkipFeedback = () => {
    handleFeedbackSubmit();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Vielen Dank!
              </h2>
              <p className="text-gray-600">
                Ihr Feedback wurde erfolgreich übermittelt. Wir schätzen Ihre Bewertung sehr.
              </p>
            </div>
            <div className="flex justify-center mb-4">
              <StarRating rating={rating} onRatingChange={() => {}} readonly size={24} />
            </div>
            {feedback && (
              <p className="text-sm text-gray-500 italic">
                "{feedback}"
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Wie war Ihre Erfahrung?
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Ihre Bewertung hilft uns, uns zu verbessern
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size={40}
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  {rating === 0 && "Bitte wählen Sie eine Bewertung"}
                  {rating === 1 && "Sehr unzufrieden"}
                  {rating === 2 && "Unzufrieden"}
                  {rating === 3 && "Neutral"}
                  {rating === 4 && "Zufrieden"}
                  {rating === 5 && "Sehr zufrieden"}
                </p>
              </div>

              <Button
                onClick={handleRatingSubmit}
                disabled={rating === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium transition-colors"
              >
                Weiter
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <StarRating rating={rating} onRatingChange={() => {}} readonly size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Möchten Sie uns mehr dazu sagen?
                </h3>
                <p className="text-gray-600 text-sm">
                  Ihr Kommentar ist optional, aber sehr wertvoll für uns
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Textarea
                    placeholder="Teilen Sie Ihre Gedanken mit uns..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="pl-12 min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSkipFeedback}
                    disabled={isSubmitting}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Überspringen
                  </Button>
                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? 'Wird gesendet...' : 'Absenden'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerFeedback;
