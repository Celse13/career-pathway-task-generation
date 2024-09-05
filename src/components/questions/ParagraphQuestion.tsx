import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ParagraphQuestionProps {
    title: string;
}

const ParagraphQuestion = ({ title } : ParagraphQuestionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <textarea className="w-full p-2 border rounded" rows={8}></textarea>
            </CardContent>
        </Card>
    );
};

export default ParagraphQuestion;
