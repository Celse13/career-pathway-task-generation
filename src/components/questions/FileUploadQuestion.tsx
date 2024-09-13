import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FileUploadQuestionProps {
    title: string;
    onAnswerChange: (answer: string[]) => void;
}

const FileUploadQuestion = ({ title, onAnswerChange } : FileUploadQuestionProps) => {
    return (
        <Card className="w-[640px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <input type="file" className="w-full p-2 border rounded" />
            </CardContent>
        </Card>
    );
};

export default FileUploadQuestion;
