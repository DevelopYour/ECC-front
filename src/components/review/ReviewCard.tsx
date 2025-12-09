import { Review, ReviewStatus } from "@/types/review";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AlertCircle, BookOpen, Calendar, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/review/${review.id}`);
    };

    const getStatusIcon = (status: ReviewStatus) => {
        switch (status) {
            case ReviewStatus.NOT_READY:
                return <AlertCircle className="w-4 h-4" />;
            case ReviewStatus.INCOMPLETE:
                return <Clock className="w-4 h-4" />;
            case ReviewStatus.COMPLETED:
                return <CheckCircle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: ReviewStatus) => {
        switch (status) {
            case ReviewStatus.NOT_READY:
                return "bg-gray-100 text-gray-800";
            case ReviewStatus.INCOMPLETE:
                return "bg-yellow-100 text-yellow-800";
            case ReviewStatus.COMPLETED:
                return "bg-green-100 text-green-800";
        }
    };

    const getStatusText = (status: ReviewStatus) => {
        switch (status) {
            case ReviewStatus.NOT_READY:
                return "준비중";
            case ReviewStatus.INCOMPLETE:
                return "미완료";
            case ReviewStatus.COMPLETED:
                return "완료";
        }
    };

    const isClickable = review.status !== ReviewStatus.NOT_READY;

    return (
        <div
            onClick={isClickable ? handleClick : undefined}
            className={`bg-gray-50 rounded-lg transition-all ${isClickable
                ? "hover:shadow-md hover:bg-gray-100 cursor-pointer"
                : "opacity-75 cursor-not-allowed"
                } p-4`}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <BookOpen className="w-5 h-5 text-gray-600 shrink-0" />
                    <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900">[{review.subjectName || "자유회화"}]</h3>
                        <h3 className="text-sm font-medium text-gray-900">{review.week}주차</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>{format(new Date(review.createdAt), "yyyy.MM.dd", { locale: ko })}</span>
                        </div>
                        {review.status === ReviewStatus.NOT_READY && (
                            <span className="text-xs text-gray-500">AI가 복습자료를 생성중입니다</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {getStatusIcon(review.status)}
                        <span>{getStatusText(review.status)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}