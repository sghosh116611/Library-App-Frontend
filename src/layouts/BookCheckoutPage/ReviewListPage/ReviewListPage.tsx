import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { Pagenation } from "../../Utils/Pagenation";
import { Review } from "../../Utils/Review";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const ReviewListPage = () => {

    const [review, setReview] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewPerPage] = useState(3);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const bookId = window.location.pathname.split("/")[2];

    // Fetch existing Review
    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewPerPage}`;

            const responseReview = await fetch(reviewUrl);

            if (!responseReview.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReview.json();

            const responseData = responseJsonReviews._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription
                });
            }

            setReview(loadedReviews);
            setIsLoading(false);
        }

        fetchBookReviews().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, [currentPage]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const indexOfLastReview: number = currentPage * reviewPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewPerPage;

    let lastItem = reviewPerPage * currentPage <= totalAmountOfReviews ? reviewPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container m-5">
            <div>
                <h3>Reviews: ({review.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
            </p>
            <div className="row">
                {review.map(r => <Review review={r} key={r.id} />)}
            </div>

            {totalPages > 1 && <Pagenation currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}