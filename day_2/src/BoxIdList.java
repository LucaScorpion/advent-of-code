import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BoxIdList {
    private final List<String> boxIds;

    public BoxIdList(List<String> boxIds) {
        this.boxIds = boxIds;
    }

    public int getChecksum() {
        var totalDoubles = 0;
        var totalTriples = 0;

        for (String id : boxIds) {
            var counts = countChars(id);
            var doubles = 0;
            var triples = 0;

            // Count the doubles and triples.
            for (Integer value : counts.values()) {
                if (value == 2) {
                    doubles = 1;
                } else if (value == 3) {
                    triples = 1;
                }
            }

            totalDoubles += doubles;
            totalTriples += triples;
        }

        return totalDoubles * totalTriples;
    }

    private Map<Character, Integer> countChars(String id) {
        // Char to amount of time that char occurs in the id.
        var charCounts = new HashMap<Character, Integer>();

        for (char c : id.toCharArray()) {
            var newCount = charCounts.getOrDefault(c, 0) + 1;
            charCounts.put(c, newCount);
        }

        return charCounts;
    }
}
