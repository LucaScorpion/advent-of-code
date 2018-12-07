import java.util.Map;
import java.util.Set;

public class Resolver {
    private final int workerCount;
    private final Map<Character, Set<Character>> dependencies;

    public Resolver(int workerCount, Map<Character, Set<Character>> dependencies) {
        this.workerCount = workerCount;
        this.dependencies = dependencies;
    }

    public void solve() {
        System.out.println("Instruction order:");

        while (!dependencies.isEmpty()) {
            // Find the first node without dependant nodes, resolve it.
            Character n = findNoDepNode(); // Explicitly define Character, otherwise the call to remove thinks its an int.
            System.out.print(n);

            dependencies.remove(n);
            dependencies.values().forEach(s -> s.remove(n));
        }

        System.out.println();
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
