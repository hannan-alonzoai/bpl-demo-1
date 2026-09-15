import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getRoom, rooms } from '../../../data/rooms';
import type { Room, ViewMode } from '../../../types';
import { ScheduleDetailBody } from './ScheduleDetailBody';
import { ScheduleDetailPanel } from './ScheduleDetailPanel';
import { StageProceedDialog } from './StageProceedDialog';
import { TheatreStripCard } from './TheatreStripCard';
import { pctForStageIndex, stageIndexFromPct } from './scheduleUtils';
const STRIP_SIZE = 4;
const MOBILE_QUERY = '(max-width: 720px)';

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return mobile;
}

export function ScheduleBoard() {
  const isMobile = useIsMobile();
  const [view, setView] = useState<ViewMode>('rings');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [stripIds, setStripIds] = useState<string[]>(() => rooms.slice(0, STRIP_SIZE).map(r => r.id));
  const [moreOpen, setMoreOpen] = useState(false);
  const [stageByRoom, setStageByRoom] = useState<Record<string, number>>({});
  const [pctByRoom, setPctByRoom] = useState<Record<string, number>>({});
  const [proceedTarget, setProceedTarget] = useState<{ roomId: string; stageIndex: number } | null>(
    null,
  );
  const topScrollRef = useRef<HTMLDivElement>(null);

  const getStageIndex = useCallback(
    (room: Room) => {
      if (room.id in stageByRoom) return stageByRoom[room.id];
      return stageIndexFromPct(room.completion.pct);
    },
    [stageByRoom],
  );

  const getCompletionPct = useCallback(
    (room: Room) => {
      if (room.id in pctByRoom) return pctByRoom[room.id];
      if (room.id in stageByRoom) return pctForStageIndex(stageByRoom[room.id]);
      return room.completion.pct;
    },
    [pctByRoom, stageByRoom],
  );

  const requestStageAdvance = useCallback(
    (roomId: string, nextIndex: number) => {
      const room = getRoom(roomId);
      if (!room) return;
      const current = getStageIndex(room);
      if (nextIndex !== current + 1) return;
      setProceedTarget({ roomId, stageIndex: nextIndex });
    },
    [getStageIndex],
  );

  const confirmStageAdvance = useCallback(() => {
    if (!proceedTarget) return;
    const { roomId, stageIndex } = proceedTarget;
    setStageByRoom(prev => ({ ...prev, [roomId]: stageIndex }));
    setPctByRoom(prev => ({ ...prev, [roomId]: pctForStageIndex(stageIndex) }));
    setProceedTarget(null);
  }, [proceedTarget]);

  const filteredRooms = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter(
      r =>
        r.id.toLowerCase().includes(q) ||
        r.patient.toLowerCase().includes(q) ||
        r.procedure.toLowerCase().includes(q),
    );
  }, [filterQuery]);

  const stripRoomsList = useMemo(
    () => stripIds.map(id => getRoom(id)).filter((r): r is Room => Boolean(r)),
    [stripIds],
  );

  const remainingRooms = useMemo(() => {
    const pinned = new Set(stripIds);
    return filteredRooms.filter(r => !pinned.has(r.id));
  }, [filteredRooms, stripIds]);

  const selectedRoom = selectedId ? getRoom(selectedId) ?? null : null;

  const promoteToStrip = useCallback((id: string) => {
    setStripIds(prev => [id, ...prev.filter(x => x !== id)].slice(0, STRIP_SIZE));
  }, []);

  const scrollCardIntoView = useCallback((id: string) => {
    requestAnimationFrame(() => {
      const el = topScrollRef.current?.querySelector(
        `.ot-theatre-card[data-id="${CSS.escape(id)}"]`,
      );
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  }, []);

  const selectRoom = useCallback(
    (id: string, opts?: { fromMore?: boolean; scrollIntoView?: boolean }) => {
      const scroll = opts?.scrollIntoView !== false;

      if (isMobile) {
        setSelectedId(prev => (prev === id ? null : id));
        return;
      }

      if (opts?.fromMore) {
        setMoreOpen(false);
        window.setTimeout(() => {
          promoteToStrip(id);
          setSelectedId(id);
          if (scroll) scrollCardIntoView(id);
        }, 420);
        return;
      }

      setSelectedId(id);
      if (scroll) scrollCardIntoView(id);
    },
    [isMobile, promoteToStrip, scrollCardIntoView],
  );

  useEffect(() => {
    if (selectedId && !filteredRooms.some(r => r.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filteredRooms, selectedId]);

  useEffect(() => {
    if (!isMobile) return;
    setMoreOpen(false);
  }, [isMobile]);

  const roomCountLabel =
    filteredRooms.length === rooms.length
      ? `${rooms.length} rooms`
      : `${filteredRooms.length} of ${rooms.length} rooms`;

  const viewToggleMobile = isMobile && selectedRoom && (
    <div className="ot-vitals-view-bar is-visible">
      <span className="ot-vitals-view-bar-label">Patient vitals display</span>
      <div className="view-toggle" role="group" aria-label="Vitals display">
        {(['rings', 'bars', 'numbers'] as ViewMode[]).map(v => (
          <button
            key={v}
            type="button"
            className={view === v ? 'active' : ''}
            onClick={() => setView(v)}
          >
            {v === 'rings' ? 'Rings' : v === 'bars' ? 'Bars' : 'Numbers'}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="schedule-board">
      <div className="page">
        <h1 className="page-title">Surgery Schedule</h1>
        <div className="ot-strip-section">
          <div className="ot-strip-toolbar">
            <input
              type="search"
              className="ot-search"
              placeholder="Search OT, patient, or procedure…"
              autoComplete="off"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
            />
            <span className="ot-count">{roomCountLabel}</span>
          </div>
          {viewToggleMobile}
          <div className="ot-top-scroll" ref={topScrollRef}>
            <div className={`ot-top-row strip-row${isMobile ? ' mobile-stack' : ''}`}>
              {isMobile ? (
                filteredRooms.length === 0 ? (
                  <p className="ot-count" style={{ padding: '12px 4px' }}>
                    No rooms match your search.
                  </p>
                ) : (
                  filteredRooms.map(room => {
                    const open = room.id === selectedId;
                    return (
                      <div
                        className={`ot-mobile-item${open ? ' is-open' : ''}`}
                        key={room.id}
                        data-id={room.id}
                      >
                        <TheatreStripCard
                          room={room}
                          stageIndex={getStageIndex(room)}
                          completionPct={getCompletionPct(room)}
                          selected={open}
                          onSelect={() => selectRoom(room.id)}
                        />
                        <div className={`ot-card-expand${open ? ' open' : ''}`} aria-hidden={open ? 'false' : 'true'}>
                          <div className="ot-card-expand-inner detail-body">
                            {open && selectedRoom && (
                              <ScheduleDetailBody
                                room={selectedRoom}
                                view={view}
                                stageIndex={getStageIndex(selectedRoom)}
                                onRequestStageAdvance={next =>
                                  requestStageAdvance(selectedRoom.id, next)
                                }
                                mobileExpand
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )
              ) : stripRoomsList.length === 0 ? (
                <p className="ot-count" style={{ padding: '12px 4px', gridColumn: '1 / -1' }}>
                  No pinned rooms.
                </p>
              ) : (
                <>
                  {stripRoomsList.map(room => (
                    <TheatreStripCard
                      key={room.id}
                      room={room}
                      stageIndex={getStageIndex(room)}
                      completionPct={getCompletionPct(room)}
                      selected={room.id === selectedId}
                      onSelect={() => selectRoom(room.id)}
                    />
                  ))}
                  {remainingRooms.length > 0 && (
                    <button
                      type="button"
                      className={`ot-expand-btn${moreOpen ? ' open' : ''}`}
                      aria-expanded={moreOpen}
                      aria-controls="ot-more-panel"
                      title={`Show ${remainingRooms.length} more rooms`}
                      onClick={() => setMoreOpen(o => !o)}
                    >
                      <span className="ot-expand-chevron" aria-hidden="true">
                        ▼
                      </span>
                      <span className="ot-expand-count">+{remainingRooms.length}</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          {!isMobile && (
            <div
              className={`ot-more-panel${moreOpen ? ' open' : ''}`}
              id="ot-more-panel"
              aria-hidden={moreOpen ? 'false' : 'true'}
            >
              <div className="ot-more-panel-inner">
                <div className="ot-more-grid">
                  {moreOpen &&
                    remainingRooms.map(room => (
                      <TheatreStripCard
                        key={room.id}
                        room={room}
                        stageIndex={getStageIndex(room)}
                        completionPct={getCompletionPct(room)}
                        selected={room.id === selectedId}
                        onSelect={() => selectRoom(room.id, { fromMore: true })}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {!isMobile && (
          <ScheduleDetailPanel
            room={selectedRoom}
            view={view}
            stageIndex={selectedRoom ? getStageIndex(selectedRoom) : 0}
            onViewChange={setView}
            onRequestStageAdvance={
              selectedRoom
                ? next => requestStageAdvance(selectedRoom.id, next)
                : () => {}
            }
          />
        )}

        {proceedTarget && (
          <StageProceedDialog
            targetStageIndex={proceedTarget.stageIndex}
            onConfirm={confirmStageAdvance}
            onCancel={() => setProceedTarget(null)}
          />
        )}
      </div>
    </div>
  );
}
