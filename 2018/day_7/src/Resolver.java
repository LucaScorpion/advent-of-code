import java.util.*;

public class Resolver {
    private final int workerCount;
    private final Map<Character, Set<Character>> dependencies = new HashMap<>();

    private int second = -1;
    private final List<Workload> work = new ArrayList<>();

    public Resolver(int workerCount, Map<Character, Set<Character>> dependencies) {
        this.workerCount = workerCount;

        // Deep copy the dependencies.
        dependencies.forEach((c, d) -> this.dependencies.put(c, new HashSet<>(d)));
    }

    public void solve() {
        System.out.printf("Solving with %d worker(s).%n", workerCount);
        System.out.println("Instruction order:");

        while (!dependencies.isEmpty() || !work.isEmpty()) {
            tick();
        }

        System.out.printf("%nTime: %d seconds.%n", second);
    }

    private void tick() {
        second++;

        // Check if work is done.
        for (int i = work.size() - 1; i >= 0; i--) {
            Workload w = work.get(i);

            if (second >= w.getDoneTime()) {
                work.remove(i);

                // Node is done, remove it from all dependencies.
                dependencies.values().forEach(deps -> deps.remove(w.getNode()));
                System.out.print(w.getNode());
            }
        }

        // Check if more work can be done.
        Workload w;
        while (!dependencies.isEmpty() && work.size() < workerCount && (w = nextWorkload()) != null) {
            work.add(w);
        }
    }

    private Workload nextWorkload() {
        // Find and remove the first node without dependencies.
        Character n = findNoDepNode();
        if (n == null) {
            return null;
        }

        dependencies.remove(n);
        return new Workload(n, second);
    }

    private Character findNoDepNode() {
        // Find the first node without dependencies, or error.
        for (var ord = 65; ord <= 90; ord++) {
            char n = (char) ord;

            if (dependencies.containsKey(n) && dependencies.get(n).isEmpty()) {
                return n;
            }
        }
        return null;
    }
}
