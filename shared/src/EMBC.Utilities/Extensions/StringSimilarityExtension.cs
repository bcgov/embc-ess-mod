using System;
using System.Text.RegularExpressions;

namespace EMBC.Utilities.Extensions
{
    public static class StringSimilarityExtensions
    {
        /// <summary>
        /// Combines Double Metaphone, Dice Coefficient, Levenshtein Distance, and Longest Common Subsequence
        /// to compute an overall similarity score between two strings.
        /// </summary>
        /// <param name="input">The first string to compare.</param>
        /// <param name="comparedTo">The second string to compare.</param>
        /// <returns>A score between 0 and 1 representing the similarity of the strings.</returns>
        public static double CombinedSimilarity(this string input, string comparedTo)
        {
            // Reject empty strings
            if (string.IsNullOrWhiteSpace(input) || string.IsNullOrWhiteSpace(comparedTo))
                return 0.0;

            // Direct equality check
            if (string.Equals(input, comparedTo, StringComparison.OrdinalIgnoreCase))
                return 1.0;

            // Normalize and optionally lowercase the strings
            input = NormalizeString(input);
            comparedTo = NormalizeString(comparedTo);

            // Compute double metaphone similarity
            string metaInput = input.ToDoubleMetaphone();
            string metaComparedTo = comparedTo.ToDoubleMetaphone();
            double metaphoneScore = metaInput == metaComparedTo ? 1.0 : 0.0;

            // Compute dice coefficient
            double diceCoefficient = input.DiceCoefficient(comparedTo);

            // Compute levenshtein distance and score
            int maxLen = Math.Max(input.Length, comparedTo.Length);
            int levenshteinDistance = input.LevenshteinDistance(comparedTo);
            double levenshteinScore = 1.0 - ((double)levenshteinDistance / maxLen);

            // Compute longest common subsequence and score
            var lcsResult = input.LongestCommonSubsequence(comparedTo);
            double lcsScore = lcsResult.Item2;

            // Combine the scores with weights
            const double metaphoneWeight = 0.4;
            const double diceWeight = 0.3;
            const double levenshteinWeight = 0.2;
            const double lcsWeight = 0.1;

            // Compute the overall weighted score
            double combinedScore =
                (metaphoneScore * metaphoneWeight) +
                (diceCoefficient * diceWeight) +
                (levenshteinScore * levenshteinWeight) +
                (lcsScore * lcsWeight);

            return combinedScore;
        }

        private static string NormalizeString(string input)
        {
            return Regex.Replace(input, @"[^a-zA-Z]+", "").ToLower();
        }
    }
}
