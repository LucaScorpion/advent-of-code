import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class Main {
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

        new Resolver(1, dependencies).solve();
        System.out.println();
        new Resolver(5, dependencies).solve();
    }

    private void parseLine(String line) {
        char dependency = line.charAt(5);
        char node = line.charAt(36);

        // Ensure an entry exists for the dependency.
        if (!dependencies.containsKey(dependency)) {
            dependencies.put(dependency, new HashSet<>());
        }

        // Add the dependency.
        var nodeDeps = dependencies.getOrDefault(node, new HashSet<>());
        nodeDeps.add(dependency);
        dependencies.put(node, nodeDeps);
    }
}
