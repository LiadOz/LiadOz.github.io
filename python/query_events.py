from SPARQLWrapper import SPARQLWrapper, JSON
import datetime


def get_events(endpoint_url, query):
    sparql = SPARQLWrapper(endpoint_url)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()


def create_event_list(new_events, ev_type):
    new_events = new_events['results']['bindings']
    event_list = []
    for ev in new_events:
        event_list.append({'date': xml_time_to_datetime(ev['date']['value']),'title': ev['titleLabel']['value'],
                           'location': ev['locationLabel']['value'].lower(), 'ev_type': ev_type})
    return event_list


# Returns video games that will be released in the future in an array of dictionaries of each new game.
def query_video_games():
    q_site = "https://query.wikidata.org/sparql"
    query = """
    SELECT ?titleLabel ?date ?locationLabel WHERE {
        ?title wdt:P31 wd:Q7889;
        p:P577 ?statement. # Getting all release date locations.
        ?statement ps:P577 ?date.
        BIND("worldwide" AS ?default_location)
        OPTIONAL { ?statement pq:P291 ?location. }
        BIND(COALESCE(?location, ?default_location) AS ?location)
        FILTER(?date >= (NOW())) # Deleting all entries from before today.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    ORDER BY (?date)

    """
    games = get_events(q_site, query)
    return create_event_list(games, 'video games')


def query_elections():
    q_site = "https://query.wikidata.org/sparql"
    query = """
    SELECT (SAMPLE(?title) AS ?titleLabel) ?date ?locationLabel 
    WHERE {

      # Getting all election types
      ?electionType wdt:P279+ wd:Q40231 .
      FILTER NOT EXISTS {
        ?electionType wdt:P279+ wd:Q15966540 . # Filtering local elections subclasses
      }
      FILTER NOT EXISTS {
        ?election wdt:P31 wd:Q15966540 . # Filtering local elections
      }

      # Getting all elections data
      ?election wdt:P31 ?electionType; 
                wdt:P17 ?country;
                wdt:P585 ?date;
                p:P585/psv:P585 ?timenode;
                rdfs:label ?default_title.
      FILTER (lang(?default_title) = 'en')

      OPTIONAL {
        ?election wdt:P361 ?partOf .
        ?partOf rdfs:label ?partOfTitle.
        FILTER (lang(?partOfTitle) = 'en')
      }
      BIND(COALESCE(?partOfTitle, ?default_title) AS ?title)


      # Filtering non accurate dates
      ?timenode wikibase:timePrecision ?timePrecision .
      FILTER (?timePrecision >= 11) 

      # Creating labels
      ?country rdfs:label ?locationLabel .
      ?electionType rdfs:label ?description .


      FILTER (lang(?locationLabel) = 'en')
      FILTER (lang(?description) = 'en')
      FILTER(?date >= (NOW()))

    }
    GROUP BY ?date ?locationLabel
    ORDER BY(?date)
    """
    elections = get_events(q_site, query)
    return create_event_list(elections, 'elections')

def query_movies():
    q_site = "https://query.wikidata.org/sparql"
    query = """
    SELECT ?titleLabel ?date ?locationLabel WHERE {
{
SELECT ?title ?titleLabel ?date ?locationLabel
WHERE
{

  ?title wdt:P31 wd:Q11424;
        p:P577 ?statement. # Getting all release date locations.
  ?statement ps:P577 ?date.
  ?statement psv:P577 ?timenode.
  FILTER(?date >= now())
  
  BIND("worldwide" AS ?default_location)
  OPTIONAL { ?statement pq:P291 ?location. }
  BIND(COALESCE(?location, ?default_location) AS ?location)
    
  ?timenode wikibase:timePrecision ?timePrecision .
  FILTER (?timePrecision >= 11) 
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
}
FILTER (!REGEX(?titleLabel, "^Q[0-9]+$")) # Filter those with no label.
}ORDER BY (?date)
"""
    movies = get_events(q_site, query)
    return create_event_list(movies, 'movies')


def xml_time_to_datetime(xml_time):
    return datetime.datetime.strptime(xml_time, "%Y-%m-%dT%H:%M:%Sz")


