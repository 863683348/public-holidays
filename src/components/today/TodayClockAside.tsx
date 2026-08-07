import WorldClock from "@/components/WorldClock";
import styles from "./today-clock.module.css";

// Sidebar container for the reused WorldClock. The clock's own grid is a
// self-contained responsive layout that assumes a full-width container; in the
// narrow /today right rail its 3-up cards would be unreadable, so the module
// below pins it to a single compact stack on desktop while leaving the mobile
// (stacked) layout on the clock's native grid.
export default function TodayClockAside() {
  return (
    <div className={styles.clockStack}>
      <WorldClock />
    </div>
  );
}
