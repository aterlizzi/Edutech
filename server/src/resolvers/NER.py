import nltk
import sys
from nltk.tag.stanford import StanfordNERTagger

PATH_TO_JAR = sys.argv[1]
PATH_TO_MODEL = sys.argv[2]
text = sys.argv[3]

tagger = StanfordNERTagger(
    model_filename=PATH_TO_MODEL, path_to_jar=PATH_TO_JAR, encoding='utf-8')

words = nltk.word_tokenize(text)
tagged = tagger.tag(words)

print(tagged)
