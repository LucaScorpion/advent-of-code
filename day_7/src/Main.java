import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class Main {
    private final List<Character> nodes = new ArrayList<>();
    private final Map<Character, Set<Character>> dependencies = new HashMap<>();

    public static void main(String[] args) {
        new Main().run();
    }

    private void run() {
        // Read all lines.
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in))) {
            String line;
            while ((line = reader.readLine()) != null) {
                parseLine(line);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Could not read input.", e);
        }

        nodes.sort(Character::compareTo);
        System.out.println("Instruction order:");
        solve();
        System.out.println();
    }

    private void parseLine(String line) {
        char dependency = line.charAt(5);
        char node = line.charAt(36);

        storeNode(dependency);
        storeNode(node);

        // Add the dependency.
        var nodeDeps = dependencies.getOrDefault(node, new HashSet<>());
        nodeDeps.add(dependency);
        dependencies.put(node, nodeDeps);
    }

    private void storeNode(char n) {
        if (!nodes.contains(n)) {
            nodes.add(n);
        }
    }

    private void solve() {
        while (!nodes.isEmpty()) {
            // Find the first node without dependant nodes, resolve it.
            Character n = findNoDepNode(); // Explicitly define Character, otherwise the call to remove thinks its an int.
            System.out.print(n);

            nodes.remove(n);
            dependencies.values().forEach(s -> s.remove(n));
        }
    }

    private char findNoDepNode() {
        // Find the first node without dependencies, or error.
        for (Character n : nodes) {
            if (dependencies.getOrDefault(n, new HashSet<>()).isEmpty()) {
                return n;
            }
        }
        throw new IllegalStateException("No 0-dependency node found.");
    }
}
