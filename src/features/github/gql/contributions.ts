export const getContributionCalendarQuery = () =>
  `contributionsCollection(from:$from, to:$to) {
  totalIssueContributions
  totalCommitContributions
  totalPullRequestContributions
  totalPullRequestReviewContributions
  totalRepositoriesWithContributedCommits
  totalRepositoriesWithContributedIssues
  totalRepositoriesWithContributedPullRequestReviews
  totalRepositoriesWithContributedPullRequests
  totalRepositoryContributions
  contributionCalendar {
    weeks {
      contributionDays {
        contributionCount
        date
        color
      }
    }
  }
}`;
