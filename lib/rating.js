export function getAverageRating(reviews) {
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function addRating(food) {
  const { reviews, ...rest } = food;

  return {
    ...rest,
    rating: getAverageRating(reviews),
    reviewCount: reviews ? reviews.length : 0,
  };
}
