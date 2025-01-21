using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace EMBC.Utilities.Extensions
{
    public static class StringSimilarityExtensions
    {
        /// <summary>
        /// Combines Double Metaphone, Dice Coefficient, Levenshtein Distance, and Longest Common Subsequence
        /// to compute an overall similarity score between two strings, with multi-word support and forgiving scoring.
        /// </summary>
        public static double CombinedSimilarity(this string input, string comparedTo)
        {
            if (string.IsNullOrWhiteSpace(input) || string.IsNullOrWhiteSpace(comparedTo))
                return 0.0;

            input = NormalizeString(input);
            comparedTo = NormalizeString(comparedTo);

            if (input.Equals(comparedTo, StringComparison.OrdinalIgnoreCase))
                return 1.0;

            // Handle multi-word strings
            if (input.Contains(' ') || comparedTo.Contains(' '))
            {
                var inputWords = input.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                var comparedToWords = comparedTo.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

                if (inputWords.Length == 0 || comparedToWords.Length == 0)
                    return 0.0;

                // Calculate best matches for each word and average the scores
                double totalScore = inputWords
                    .Select(word => comparedToWords.Max(cw => CalculateWordScore(word, cw)))
                    .Sum();

                return totalScore / inputWords.Length;
            }

            // Single-word comparison
            return CalculateWordScore(input, comparedTo);
        }

        private static double CalculateWordScore(string input, string comparedTo)
        {
            // Double Metaphone partial match
            string metaInput = input.ToDoubleMetaphone();
            string metaComparedTo = comparedTo.ToDoubleMetaphone();
            int metaMatch = 0;
            for (int i = 0; i < Math.Max(metaInput.Length, metaComparedTo.Length); i++)
            {
                if (i < metaInput.Length && i < metaComparedTo.Length && metaInput[i] == metaComparedTo[i])
                    metaMatch++;
            }
            double metaphoneScore = metaMatch / (double)Math.Max(metaInput.Length, metaComparedTo.Length);

            // Dice Coefficient
            double dice = input.DiceCoefficient(comparedTo);

            // Levenshtein Score: 1 / (distance + 0.2)
            int levenshteinDistance = input.LevenshteinDistance(comparedTo);
            double levenshteinScore = 1.0 / (levenshteinDistance + 0.2);

            // Longest Common Subsequence
            double lcsScore = input.LongestCommonSubsequence(comparedTo).Item2;

            // Equal weights for all metrics
            return (metaphoneScore + dice + levenshteinScore + lcsScore) / 4;
        }

        private static string NormalizeString(string input)
        {
            // Keep alphanumeric and spaces, then lowercase
            return Regex.Replace(input, @"[^a-zA-Z0-9 ]+", "").ToLowerInvariant();
        }
    }
}