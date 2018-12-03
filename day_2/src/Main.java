import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class Main {
    private BoxIdList ids;

    public static void main(String[] args) {
        new Main().run();
    }

    private void run() {
        List<String> lines = new ArrayList<>();

        // Read all lines.
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in))) {
            String line;
            while ((line = reader.readLine()) != null) {
                lines.add(line);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Could not read input.", e);
        }

        ids = new BoxIdList(lines);
        System.out.printf("Checksum: %d.\n", ids.getChecksum());
        System.out.printf("Found matching id: %s\n", ids.findMatchingId());
    }
}
