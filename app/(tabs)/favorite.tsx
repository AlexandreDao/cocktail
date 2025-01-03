import FavoriteItem from '@/components/ui/FavoriteItem'
import { BACKGROUND_COLOR, SEPARATOR_COLOR } from '@/constants/colors'
import useSortedFavorites from '@/hooks/useSortedFavorites'
import { CocktailDetail } from '@/types/Cocktail'
import { FlashList, ListRenderItem } from '@shopify/flash-list'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  separator: {
    height: 1,
    backgroundColor: SEPARATOR_COLOR,
  },
})

export default function Index() {
  const favorites = useSortedFavorites()

  const renderItem: ListRenderItem<CocktailDetail> = ({ item }) => {
    const isFavorite = favorites.findIndex((favorite) => favorite.id === item.id) !== -1

    return <FavoriteItem shouldAnimateRemove item={item} isFavorite={isFavorite} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlashList
        estimatedItemSize={20}
        keyExtractor={(item) => item.id}
        data={favorites}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={renderItem}
      />
    </SafeAreaView>
  )
}
