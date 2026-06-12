import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, Text, View, Alert } from "react-native";
import { router, useFocusEffect, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  listNotes,
  searchNotes,
  deleteNote,
  generateId,
  type NoteMeta,
} from "@/lib/storage";
import NoteCard from "@/components/NoteCard";
import SearchBar from "@/components/SearchBar";
import ViewToggle from "@/components/ViewToggle";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/lib/useThemeColors";

export default function NoteList() {
  const colors = useThemeColors();
  const [notes, setNotes] = useState<NoteMeta[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  async function loadNotes() {
    if (searchQuery.trim()) {
      const results = await searchNotes(searchQuery);
      setNotes(results);
    } else {
      const all = await listNotes();
      setNotes(all);
    }
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      if (query.trim()) {
        const results = await searchNotes(query);
        setNotes(results);
      } else {
        const all = await listNotes();
        setNotes(all);
      }
    }, 300);
  }

  function handleCreate() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const id = generateId();
    router.push(`/note/${id}`);
  }

  function handleDelete(note: NoteMeta) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Delete note", `Delete "${note.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteNote(note.id);
          setNotes((prev) => prev.filter((n) => n.id !== note.id));
        },
      },
    ]);
  }

  const pinnedNotes = useMemo(
    () => notes.filter((n) => n.pinned),
    [notes]
  );
  const unpinnedNotes = useMemo(
    () => notes.filter((n) => !n.pinned),
    [notes]
  );
  const hasPinned = pinnedNotes.length > 0;

  function renderSectionHeader(title: string) {
    return (
      <View className="mt-4 mb-2 px-1">
        <Text style={{ color: colors.ink.muted }} className="text-xs font-bold tracking-widest uppercase">
          {title}
        </Text>
      </View>
    );
  }

  function renderMasonry(data: NoteMeta[]) {
    const left: NoteMeta[] = [];
    const right: NoteMeta[] = [];
    data.forEach((item, i) => {
      if (i % 2 === 0) left.push(item);
      else right.push(item);
    });

    return (
      <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          {left.map((item) => (
            <NoteCard
              key={item.id}
              note={item}
              onPress={() => router.push(`/note/${item.id}`)}
              onLongPress={() => handleDelete(item)}
              compact
            />
          ))}
        </View>
        <View style={{ flex: 1 }}>
          {right.map((item) => (
            <NoteCard
              key={item.id}
              note={item}
              onPress={() => router.push(`/note/${item.id}`)}
              onLongPress={() => handleDelete(item)}
              compact
            />
          ))}
        </View>
      </View>
    );
  }

  function renderList(data: NoteMeta[]) {
    return data.map((item) => (
      <NoteCard
        key={item.id}
        note={item}
        onPress={() => router.push(`/note/${item.id}`)}
        onLongPress={() => handleDelete(item)}
      />
    ));
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Sticky",
          headerRight: () => (
            <ViewToggle
              mode={viewMode}
              onToggle={() =>
                setViewMode((m) => (m === "grid" ? "list" : "grid"))
              }
            />
          ),
        }}
      />
      <View style={{ backgroundColor: colors.paper }} className="flex-1">
        <SearchBar value={searchQuery} onChangeText={handleSearch} />

        {notes.length === 0 ? (
          <View className="flex-1 items-center justify-center px-10">
            <Text className="text-4xl mb-3">✏️</Text>
            <Text style={{ color: colors.ink.secondary }} className="text-base text-center font-medium leading-6">
              {searchQuery
                ? "Nothing found."
                : "Your notes will appear here."}
            </Text>
            {!searchQuery && (
              <Text style={{ color: colors.ink.muted }} className="text-sm text-center mt-1">
                Tap the button below to start writing.
              </Text>
            )}
          </View>
        ) : (
          <FlatList
            data={[1]}
            keyExtractor={() => "content"}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            renderItem={() => (
              <View>
                {hasPinned && (
                  <>
                    {renderSectionHeader("Pinned")}
                    {viewMode === "grid"
                      ? renderMasonry(pinnedNotes)
                      : renderList(pinnedNotes)}
                    {unpinnedNotes.length > 0 &&
                      renderSectionHeader("Others")}
                  </>
                )}
                {viewMode === "grid"
                  ? renderMasonry(unpinnedNotes)
                  : renderList(unpinnedNotes)}
              </View>
            )}
          />
        )}

        <Pressable
          onPress={handleCreate}
          style={{
            backgroundColor: colors.accent.DEFAULT,
            shadowColor: colors.accent.DEFAULT,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
          className="absolute bottom-8 right-6 w-14 h-14 rounded-2xl items-center justify-center"
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>
      </View>
    </>
  );
}
