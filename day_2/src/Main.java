import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

public class Main {
    private int doubles;
    private int triples;

    public static void main(String[] args) {
        new Main().run();
    }

    private void run() {
        // Read all lines.
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in))) {
            String line;
            while ((line = reader.readLine()) != null) {
                processLine(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.printf("Found %d doubles and %d triples.\n", doubles, triples);
        System.out.printf("Checksum: %d.\n", doubles * triples);
    }

    private void processLine(String line) {
        var counts = countChars(line);
        var addDoubles = 0;
        var addTriples = 0;

        // Count the doubles and triples.
        for (Integer value : counts.values()) {
            if (value == 2) {
                addDoubles = 1;
            } else if (value == 3) {
                addTriples = 1;
            }
        }

        doubles += addDoubles;
        triples += addTriples;
    }

    /**
     * Count the amount of each character in a string.
     *
     * @param line The string to count the characters in.
     * @return A map containing all characters and their counts.
     */
    private Map<Character, Integer> countChars(String line) {
        var charCounts = new HashMap<Character, Integer>();

        for (char c : line.toCharArray()) {
            var newCount = charCounts.getOrDefault(c, 0) + 1;
            charCounts.put(c, newCount);
        }

        return charCounts;
    }
}
