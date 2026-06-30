import type { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  FieldContent,
} from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Sozlamalar",
}

export default function SettingsPage() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sozlamalar</h1>
        <p className="text-sm text-muted-foreground">
          Profil, ko&apos;rinish va bildirishnomalarni boshqaring.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Bu ma&apos;lumotlar jamoangizga ko&apos;rinadi.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="s-name">Ism</FieldLabel>
              <Input id="s-name" defaultValue="Sofia Rashidova" />
            </Field>
            <Field>
              <FieldLabel htmlFor="s-email">Email</FieldLabel>
              <Input id="s-email" type="email" defaultValue="sofia@example.com" />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="s-company">Kompaniya</FieldLabel>
              <Input id="s-company" defaultValue="Acme Inc" />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t">
          <Button variant="outline">Bekor qilish</Button>
          <Button>Saqlash</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ko&apos;rinish</CardTitle>
          <CardDescription>
            Brend rangi va yorug&apos;/qorong&apos;u rejimni yuqori o&apos;ng burchakdagi
            tugmalar orqali almashtiring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Ixcham rejim</FieldTitle>
                <FieldDescription>Jadval va kartalarni zichroq ko&apos;rsatish.</FieldDescription>
              </FieldContent>
              <Switch defaultChecked={false} />
            </Field>
            <Separator />
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Animatsiyalar</FieldTitle>
                <FieldDescription>Sahifa va kartalardagi kirish animatsiyalari.</FieldDescription>
              </FieldContent>
              <Switch defaultChecked />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bildirishnomalar</CardTitle>
          <CardDescription>Qaysi hodisalar haqida xabar olishni tanlang.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Yangi buyurtmalar</FieldTitle>
                <FieldDescription>Har bir yangi buyurtma uchun email.</FieldDescription>
              </FieldContent>
              <Switch defaultChecked />
            </Field>
            <Separator />
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Haftalik hisobot</FieldTitle>
                <FieldDescription>Har dushanba kuni umumiy statistika.</FieldDescription>
              </FieldContent>
              <Switch defaultChecked />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
