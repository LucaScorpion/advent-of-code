public class Workload {
    private static final int BASE_TIME = 60;

    private final Character node;
    private final int time;
    private final int startSecond;

    public Workload(char c, int startSecond) {
        node = c;
        time = BASE_TIME + c - 64; // Subtract A (65), min is 1.
        this.startSecond = startSecond;
    }

    public int getDoneTime() {
        return startSecond + time;
    }

    public Character getNode() {
        return node;
    }
}
