import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class Resolver {
    private final int workerCount;
    private final Map<Character, Set<Character>> dependencies = new HashMap<>();

    private int second = -1;

    public Resolver(int workerCount, Map<Character, Set<Character>> dependencies) {
        this.workerCount = workerCount;

        // Deep copy the dependencies.
        dependencies.forEach((c, d) -> this.dependencies.put(c, new HashSet<>(d)));
    }

    public void solve() {
        System.out.printf("Solving with %d worker(s).%n", workerCount);
        System.out.print("Instruction order: ");

        while (!dependencies.isEmpty()) {
            tick();
        }

        System.out.printf("%nTime: %d seconds.%n", second);
    }

    private void tick() {
        second++;
        resolveNext();
    }

    private void resolveNext() {
        // Find the first node without dependant nodes, resolve it.
        Character n = findNoDepNode(); // Explicitly define Character, otherwise the call to remove thinks its an int.
        System.out.print(n);

        dependencies.remove(n);
        dependencies.values().forEach(s -> s.remove(n));
    }

    private char findNoDepNode() {
        // Find the first node without dependencies, or error.
        for (var ord = 65; ord <= 90; ord++) {
            char n = (char) ord;

            if (dependencies.containsKey(n) && dependencies.get(n).isEmpty()) {
                return n;
            }
        }
        throw new IllegalStateException("No 0-dependency node found.");
    }
}
