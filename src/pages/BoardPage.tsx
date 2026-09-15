import { BoardHeader } from '../components/board/BoardHeader';
import { ScheduleBoard } from '../components/board/schedule/ScheduleBoard';
import '../styles/board.css';
import '../styles/schedule-board.css';

export function BoardPage() {
  return (
    <>
      <div id="dashboard-screen" style={{ display: 'block' }}>
        <BoardHeader />
        <div className="dash-body">
          <ScheduleBoard />
        </div>
      </div>
    </>
  );
}
