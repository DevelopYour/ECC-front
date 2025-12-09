"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { reviewApi } from "@/lib/api";
import { Review } from "@/types/review";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import ReviewDetail from "@/components/review/ReviewDetail";

export default function ReviewDetailPage() {
    const params = useParams();
    const router = useRouter();
    const reviewId = params.reviewId as string;

    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (reviewId) {
            fetchReview();
        }
    }, [reviewId]);

    const fetchReview = async () => {
        try {
            setLoading(true);
            const response = await reviewApi.getReview(reviewId);
            if (response.success && response.data) {
                setReview(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch review:", error);
            toast.error("오류", {
                description: "복습자료를 불러오는데 실패했습니다",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStartTest = () => {
        router.push(`/review/${reviewId}/test`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">복습자료를 찾을 수 없습니다</p>
                <button
                    onClick={() => router.push("/review")}
                    className="mt-4 text-primary hover:underline"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    // 상태별 배지 렌더링 함수
    const getStatusBadge = (status: Review['status']) => {
        const Badge = ({ children, className }: { children: React.ReactNode; className: string }) => (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${className}`}>
                {children}
            </span>
        );

        switch (status) {
            case 'NOT_READY':
                return (
                    <Badge className="bg-gray-100 text-gray-800">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        준비중
                    </Badge>
                );
            case 'INCOMPLETE':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        미완료
                    </Badge>
                );
            case 'COMPLETED':
                return (
                    <Badge className="bg-green-100 text-green-800">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        완료
                    </Badge>
                );
        }
    };

    // 학습 통계 계산
    const getSpeakingStats = () => {
        if (!review.topics) return { totalExpressions: 0 };
        const translationCount = review.topics.reduce((acc, topic) =>
            acc + (topic.translations?.length || 0), 0);
        const feedbackCount = review.topics.reduce((acc, topic) =>
            acc + (topic.feedbacks?.length || 0), 0);
        return { totalExpressions: translationCount + feedbackCount };
    };

    const getGeneralStats = () => {
        const correctionCount = review.corrections?.length || 0;
        const vocabCount = review.vocabs?.length || 0;
        const translationCount = review.translations?.length || 0;
        const feedbackCount = review.feedbacks?.length || 0;
        return { total: correctionCount + vocabCount + translationCount + feedbackCount };
    };

    const speakingStats = getSpeakingStats();
    const generalStats = getGeneralStats();
    const hasSpeaking = review.topics && review.topics.length > 0;
    const hasGeneral = generalStats.total > 0;

    return (
        <div className="space-y-6">
            {/* 페이지 제목 */}
            <div>
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">[{review.subjectName || "자유회화"}] {review.week}주차 복습</h1>
                    {getStatusBadge(review.status)}
                </div>
            </div>

            <ReviewDetail review={review} onStartTest={handleStartTest} />

            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>뒤로가기</span>
            </button>
        </div>
    );
}