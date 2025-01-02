import FavoriteItem from '@/components/ui/FavoriteItem'
import { BACKGROUND_COLOR, SEPARATOR_COLOR } from '@/constants/colors'
import { useAppSelector } from '@/hooks/store/useAppSelector'
import { useDetailsBottomSheet } from '@/hooks/useDetailsBottomSheet'
import useSortedFavorites from '@/hooks/useSortedFavorites'
import { FlashList } from '@shopify/flash-list'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  separator: {
    height: 1, 
    backgroundColor: SEPARATOR_COLOR
  }
})

export default function Index() {
  const favorites = useSortedFavorites()
  const { open } = useDetailsBottomSheet()
  
  return (
    <View style={styles.container}>
      <FlashList
        estimatedItemSize={20}
        keyExtractor={(item) => item.id}
        data={favorites}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({item}) => {
          const isFavorite = favorites.findIndex(favorite => favorite.id === item.id) !== -1
          
          return (
            <FavoriteItem
              shouldAnimateRemove
              item={item}
              isFavorite={isFavorite}
              onPress={() => {
                open(item)
              }}
            />
          )
        }}
      />
    </View>
  )
}
