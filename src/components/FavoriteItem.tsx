import { Text, StyleSheet, Alert, View, Platform } from 'react-native'
import React, { RefObject, useEffect } from 'react'
import { Image } from 'expo-image'
import useFavoritesStore from '@/store/favoritesStore'
import { CocktailDetail } from '@/types/cocktail'
import {
  ALCOHOLIC_CATEGORY_COLOR,
  ANDROID_RIPPLE_COLOR,
  DRINK_CATEGORY_COLOR,
  IOS_ONPRESS_COLOR,
  TEXT_COLOR,
} from '@/constants/colors'
import FavoriteButton from '@/components/FavoriteButton'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useDetailsBottomSheet } from '@/hooks/useDetailsBottomSheet'
import { FlashList } from '@shopify/flash-list'
import { capitalizeFirstLetter } from '@/utils/stringUtils'
import Category from '@/components/Category'
import HighlightText from '@/components/HighlightText'
import { Pressable } from 'react-native-gesture-handler'

interface FavItemProps {
  item: CocktailDetail
  shouldAnimateRemove?: boolean
  listRef?: RefObject<FlashList<CocktailDetail>>
  textToHighlight?: string
}

const blurhash = 'LKN]Rv%2Tw=w]~RBVZRi};RPxuwH'

const styles = StyleSheet.create({
  categoryContainer: {
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingLeft: 16,
  },
  flexContainer: {
    flex: 1,
  },
  image: {
    borderRadius: 14,
    height: 100,
    width: 100,
  },
  infoContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  ingredient: {
    color: TEXT_COLOR,
    flex: 1,
    fontSize: 12,
  },
  pressed: {
    backgroundColor: Platform.select({ ios: IOS_ONPRESS_COLOR, android: undefined }),
  },
  text: {
    color: TEXT_COLOR,
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
})

const FavoriteItem = ({ item, listRef, textToHighlight, shouldAnimateRemove = false }: FavItemProps) => {
  const favorites = useFavoritesStore((state) => state.favorites)
  const isFavorite = favorites.some((favorite) => favorite.id === item.id)
  const addToFavorite = useFavoritesStore((state) => state.addToFavorite)
  const removeFromFavorite = useFavoritesStore((state) => state.removeFromFavorite)
  const { open } = useDetailsBottomSheet()
  const height = useSharedValue(100)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    }
  })

  const handleRemove = () => {
    removeFromFavorite(item.id)
  }

  const onPressRemove = () => {
    if (shouldAnimateRemove) {
      listRef?.current?.prepareForLayoutAnimationRender()
      height.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(handleRemove)()
      })
    } else {
      handleRemove()
    }
  }

  const onPress = () => {
    open(item)
  }

  useEffect(() => {
    // Reset value when id changes (view was recycled for another item)
    height.value = 100
  }, [item.id, height])

  return (
    <View style={{ overflow: 'hidden' }}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Image
          style={styles.image}
          source={`${item.thumbnail}/preview`}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={200}
          allowDownscaling
        />
        <View style={styles.infoContainer}>
          <View style={styles.flexContainer}>
            <HighlightText style={styles.text} textToHighlight={textToHighlight} numberOfLines={1}>
              {item.name}
            </HighlightText>
            <Text style={styles.ingredient} ellipsizeMode="tail" numberOfLines={1}>
              {item.ingredientsOnly
                .map((ingredient) => {
                  return capitalizeFirstLetter(ingredient)
                })
                .join(', ')}
            </Text>
          </View>
          <View style={styles.categoryContainer}>
            {item.alcoholic && <Category title={item.alcoholic} backgroundColor={ALCOHOLIC_CATEGORY_COLOR} />}
            {item.category && <Category title={item.category} backgroundColor={DRINK_CATEGORY_COLOR} />}
          </View>
        </View>
        <Pressable
          style={({ pressed }) => {
            if (pressed) {
              return [StyleSheet.absoluteFillObject, styles.pressed]
            }
            return [StyleSheet.absoluteFillObject]
          }}
          android_ripple={{ color: ANDROID_RIPPLE_COLOR }}
          onPress={onPress}
        />
        <FavoriteButton
          isFavorite={isFavorite}
          favorite={() => {
            addToFavorite(item)
          }}
          unfavorite={() => {
            Alert.alert('Unfavorite', `Are you sure you want to remove ${item.name} from your favorites ?`, [
              { text: 'Cancel' },
              {
                text: 'Remove',
                onPress: onPressRemove,
              },
            ])
          }}
        />
      </Animated.View>
    </View>
  )
}

export default FavoriteItem
