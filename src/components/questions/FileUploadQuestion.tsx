import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FileUploadQuestionProps {
    title: string;
}

const FileUploadQuestion = ({ title } : FileUploadQuestionProps) => {
    return (
        <Card>
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
