"""
Generate human readable tokens.

Main idea is that we uniformly randomly select 6 characters, then randomly pick a word that starts with that character
for each character, where we have a list of the 128 most common English words for each character.
(if there are less than 128 common English words in our list for a character, we exclude that character, which leaves
us with 19 characters)
This gives a total number of (19*128)^6 ~= 2^67 possibilities.
"""
import random
import string
from typing import List, Dict


def load_most_common_words(min_words_per_character: int = 128) -> Dict[str, List[str]]:
    words_by_first_char = {c: [] for c in string.ascii_lowercase}
    with open('data/google-10000-english-usa-no-swears-medium.txt') as f:
        medium_words = f.readlines()
    medium_words = [x.strip() for x in medium_words]
    with open('data/google-10000-english-usa-no-swears-long.txt') as f:
        long_words = f.readlines()
    long_words = [x.strip() for x in long_words]
    words = medium_words + long_words
    for word in words:
        words_by_first_char[word[0]].append(word)
    words_by_first_char_filtered = {}
    for char, words in words_by_first_char.items():
        if len(words) >= min_words_per_character:
            words_by_first_char_filtered[char] = words[:min_words_per_character]
    return words_by_first_char_filtered


MOST_COMMON_WORDS_BY_FIRST_CHAR = load_most_common_words()


def generate_human_readable_token(num_words: int = 6) -> str:
    characters = random.choices(list(MOST_COMMON_WORDS_BY_FIRST_CHAR.keys()), k=num_words)
    return ' '.join([random.choice(MOST_COMMON_WORDS_BY_FIRST_CHAR[c]) for c in characters])
