import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../../api/events';
import { followUser, searchUsers } from '../../api/users';
import EventCard from '../../components/EventCard';
import UserCard from '../../components/UserCard';
import { FeedCommentsWindow } from '../../components/FeedCommentsWindow.jsx';
import { FeedAttendeesWindow } from '../../components/FeedAttendeesWindow.jsx';
import './Feed.css';

/** @typedef {import('../../types/event.js').Event} Event */
/** @typedef {import('../../types/user.js').UserProfile} UserProfile */

const feedAds = [
  {
    src: '/images/ads/ad-1.png',
    alt: 'Advertisement',
    href: 'https://www.llbean.com/llb/shop/129442?itemId=522444&attrValue_0=Night&sku=1000208385&qs=3152412&utm_campaign=shopping&utm_medium=SDIS&utm_source=brandpinterest&utm_content=feed&pp=0&epik=dj0yJnU9dHR6a1BtTUl0MExpaTZoRWVIQXlsMlYzOEFPcDU0OUUmcD0xJm49bnZrU3dIM2FmZkdINXVySl9Fd1R4USZ0PUFBQUFBR2wwZ3ln',
  },
  {
    src: '/images/ads/ad-2.png',
    alt: 'Advertisement',
    href: 'https://www.nba.com/playoffs/2026/nba-finals',
  },
  {
    src: '/images/ads/ad-3.png',
    alt: 'Advertisement',
    href: 'https://www.gnc.com/whey-protein/350281.html?ogmap=SHP%7CBR%7CGOOG%7CSTND%7Cc%7CSITEWIDE%7C%7C%7BG_Shopping_BR%7D%7C%7Badgroup%7D%7C%7C9279358699%7C193093729634&gclsrc=aw.ds&gad_source=1&gad_campaignid=9279358699&gbraid=0AAAAADsDbxjpSZHf_nQR18EaVqowL_z-m&gclid=CjwKCAjwxITRBhBYEiwA6mZm7c5GEssBnQM-GPMslM4rjys2YO1bQEvAS8UDAdlYjWELZQKi8MGB0RoCihUQAvD_BwE',
  },
];

function FeedAds() {
  return (
    <aside className="feed-ads" aria-label="Advertisements">
      {feedAds.map((ad) => (
        <a
          key={ad.src}
          className="feed-ad-link"
          href={ad.href}
          target="_blank"
          rel="noreferrer"
        >
          <img
            className="feed-ad-image"
            src={ad.src}
            alt={ad.alt}
          />
        </a>
      ))}
    </aside>
  );
}

/**
 * @param {Event} event
 * @param {string} query
 */
function eventMatchesQuery(event, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const searchableFields = [
    event.title,
    event.description,
    event.sport,
    event.location,
  ];

  return searchableFields.some((field) =>
    field?.toLowerCase().includes(normalizedQuery)
  );
}

export default function Feed() {
  const [events, setEvents] = useState(/** @type {Event[]} */ ([]));
  const [users, setUsers] = useState(/** @type {UserProfile[]} */ ([]));
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState(/** @type {string | null} */ (null));
  const [usersError, setUsersError] = useState(/** @type {string | null} */ (null));
  const [selectedEventAction, setSelectedEventAction] = useState(
    /** @type {{ type: 'comments' | 'attendees', event: Event } | null} */ (null)
  );
  const [followingUserId, setFollowingUserId] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEvents();
        if (!cancelled) {
          setEvents(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setUsers([]);
      setUsersError(null);
      setUsersLoading(false);
      return undefined;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setUsersLoading(true);
      setUsersError(null);

      try {
        const results = await searchUsers(trimmedQuery);
        if (!cancelled) {
          setUsers(results);
        }
      } catch (err) {
        if (!cancelled) {
          setUsers([]);
          setUsersError(
            err instanceof Error ? err.message : 'Failed to search users'
          );
        }
      } finally {
        if (!cancelled) {
          setUsersLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const filteredEvents = useMemo(
    () => events.filter((event) => eventMatchesQuery(event, searchQuery)),
    [events, searchQuery]
  );

  const isSearching = searchQuery.trim().length > 0;

  function handleRsvpChange(eventId, isRsvpd) {
    setEvents((currentEvents) =>
      currentEvents.map((event) => {
        if (event.id !== eventId) {
          return event;
        }

        const rsvpDelta = isRsvpd ? 1 : -1;
        const rsvpCount = Math.max(0, event.rsvp_count + rsvpDelta);

        return {
          ...event,
          is_rsvpd: isRsvpd,
          rsvp_count: rsvpCount,
          is_full:
            event.max_attendees !== null && rsvpCount >= event.max_attendees,
        };
      })
    );
  }

  function handleCommentClick(event) {
    setSelectedEventAction({ type: 'comments', event });
  }

  function handleShowAttendeesClick(event) {
    setSelectedEventAction({ type: 'attendees', event });
  }

  function handleCloseCommentsClick() {
    setSelectedEventAction(null);
  }

  function handleCloseAttendeesClick() {
    setSelectedEventAction(null);
  }

  async function handleFollow(followingId) {
    setFollowingUserId(followingId);
    setUsersError(null);

    try {
      await followUser(followingId);
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === followingId ? { ...user, is_following: true } : user
        )
      );
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Failed to follow user');
    } finally {
      setFollowingUserId(null);
    }
  }

  return (
    <main className="feed-page">
      <FeedAds />

      <header className="feed-header">
        <div>
          <h1>Event Feed</h1>
          <p className="feed-subtitle">
            Discover pickup games and sports meetups near you
            {!loading && !error
              ? isSearching
                ? ` · ${filteredEvents.length} event${filteredEvents.length === 1 ? '' : 's'} · ${users.length} user${users.length === 1 ? '' : 's'}`
                : events.length > 0
                  ? ` · ${events.length} event${events.length === 1 ? '' : 's'}`
                  : ''
              : ''}
          </p>
        </div>
        <Link className="feed-create-link" to="/create-event">
          Create Event
        </Link>
      </header>

      <div className="feed-search-wrap">
        <label className="feed-search-label" htmlFor="feed-search">
          Search events and users
        </label>
        <input
          id="feed-search"
          className="feed-search-input"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by title, sport, location, username, or name..."
          aria-label="Search events and users"
        />
      </div>

      {loading ? (
        <p className="feed-status" role="status">
          Loading events…
        </p>
      ) : null}

      {!loading && error ? (
        <p className="feed-status feed-status-error" role="alert">
          {error}. Make sure the backend is running on port 3001.
        </p>
      ) : null}

      {!loading && !error && !isSearching && events.length === 0 ? (
        <p className="feed-status">
          No events yet.{' '}
          <Link to="/create-event">Create the first one</Link>
        </p>
      ) : null}

      {!loading && !error && isSearching && usersLoading ? (
        <p className="feed-status" role="status">
          Searching users…
        </p>
      ) : null}

      {!loading && !error && isSearching && usersError ? (
        <p className="feed-status feed-status-error" role="alert">
          {usersError}
        </p>
      ) : null}

      {!loading && !error && isSearching && !usersLoading && !usersError && users.length === 0 ? (
        <p className="feed-status">
          No users found for &ldquo;{searchQuery.trim()}&rdquo;.
        </p>
      ) : null}

      {!loading && !error && isSearching && !usersLoading && users.length > 0 ? (
        <section className="feed-results-section" aria-label="Matching users">
          <h2 className="feed-section-title">Users</h2>
          <div className="users-grid">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollow={handleFollow}
                isFollowingUser={followingUserId === user.id}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!loading && !error && filteredEvents.length > 0 ? (
        <section className="feed-results-section" aria-label="Matching events">
          {isSearching ? <h2 className="feed-section-title">Events</h2> : null}
          <div className="feed-layout">
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRsvpChange={handleRsvpChange}
                  onCommentClick={handleCommentClick}
                  onShowAttendeesClick={handleShowAttendeesClick}
                  isCommentSelected={
                    selectedEventAction?.type === 'comments' &&
                    selectedEventAction.event.id === event.id
                  }
                  isAttendeesSelected={
                    selectedEventAction?.type === 'attendees' &&
                    selectedEventAction.event.id === event.id
                  }
                />
              ))}
            </div>

            {selectedEventAction?.type === 'comments' ? (
              <FeedCommentsWindow
                selectedCommentEvent={selectedEventAction.event}
                handleCloseCommentsClick={handleCloseCommentsClick}
              />
            ) : null}

            {selectedEventAction?.type === 'attendees' ? (
              <FeedAttendeesWindow
                selectedAttendeesEvent={selectedEventAction.event}
                handleCloseAttendeesClick={handleCloseAttendeesClick}
              />
            ) : null}

          </div>
        </section>
      ) : null}

      {!loading && !error && isSearching && filteredEvents.length === 0 ? (
        <p className="feed-status">
          No events found for &ldquo;{searchQuery.trim()}&rdquo;.
        </p>
      ) : null}
    </main>
  );
}
